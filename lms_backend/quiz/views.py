from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from decimal import Decimal
from .models import Quiz, Question, Choice, QuizAttempt, QuizAnswer
from .serializers import (
    QuizSerializer, QuizCreateSerializer, QuestionSerializer, ChoiceSerializer,
    QuizAttemptSerializer, QuizAttemptCreateSerializer, QuizSubmitSerializer,
    QuizAnswerSerializer, QuestionWithoutAnswerSerializer
)


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return QuizCreateSerializer
        return QuizSerializer

    @action(detail=True, methods=['get'])
    def start_attempt(self, request, pk=None):
        """Start a new quiz attempt or get current in-progress attempt"""
        quiz = self.get_object()
        
        # Check if there's an in-progress attempt
        existing_attempt = QuizAttempt.objects.filter(
            student=request.user,
            quiz=quiz,
            status='in_progress'
        ).first()
        
        if existing_attempt:
            serializer = QuizAttemptSerializer(existing_attempt)
            return Response(serializer.data)
        
        # Check if max attempts reached
        attempt_count = QuizAttempt.objects.filter(
            student=request.user,
            quiz=quiz
        ).count()
        
        if attempt_count >= quiz.max_attempts:
            return Response(
                {'error': f'Maximum {quiz.max_attempts} attempts allowed'},
                status=400
            )
        
        # Create new attempt
        attempt = QuizAttempt.objects.create(
            student=request.user,
            quiz=quiz,
            attempt_number=attempt_count + 1,
            max_possible_score=sum(q.points for q in quiz.questions.all())
        )
        
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def questions_for_quiz(self, request, pk=None):
        """Get questions without answers for quiz taking"""
        quiz = self.get_object()
        questions = quiz.questions.all().order_by('order')
        serializer = QuestionWithoutAnswerSerializer(questions, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Students only see their own attempts, instructors see all
        if not self.request.user.is_instructor:
            return QuizAttempt.objects.filter(student=self.request.user)
        return QuizAttempt.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return QuizAttemptCreateSerializer
        return QuizAttemptSerializer

    def perform_create(self, serializer):
        quiz = serializer.validated_data.get('quiz')
        attempt_count = QuizAttempt.objects.filter(
            student=self.request.user,
            quiz=quiz
        ).count()
        
        serializer.save(
            student=self.request.user,
            attempt_number=attempt_count + 1,
            max_possible_score=sum(q.points for q in quiz.questions.all())
        )

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit quiz answers and auto-grade"""
        attempt = self.get_object()
        
        if attempt.status == 'completed':
            return Response({'error': 'Quiz already submitted'}, status=400)
        
        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        total_score = 0
        answers_data = []
        
        for answer_data in serializer.validated_data['answers']:
            question_id = answer_data['question_id']
            choice_id = answer_data.get('choice_id')
            text_answer = answer_data.get('text_answer', '')
            
            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                continue
            
            is_correct = False
            points_earned = 0
            selected_choice = None
            
            if question.question_type == 'multiple_choice' and choice_id:
                try:
                    selected_choice = Choice.objects.get(id=choice_id)
                    is_correct = selected_choice.is_correct
                    points_earned = question.points if is_correct else 0
                except Choice.DoesNotExist:
                    pass
            elif question.question_type == 'true_false':
                is_correct = text_answer.lower() == question.correct_answer.lower()
                points_earned = question.points if is_correct else 0
            elif question.question_type == 'short_answer':
                # Short answer requires manual grading
                is_correct = False
                points_earned = 0
            
            QuizAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_choice=selected_choice,
                text_answer=text_answer,
                is_correct=is_correct,
                points_earned=points_earned
            )
            
            total_score += points_earned
        
        # Calculate final score
        attempt.score = total_score
        attempt.percentage = (total_score / attempt.max_possible_score * 100) if attempt.max_possible_score > 0 else 0
        attempt.is_passed = attempt.percentage >= attempt.quiz.passing_score
        attempt.status = 'completed'
        attempt.completed_at = timezone.now()
        attempt.save()
        
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_attempts(self, request):
        """Get current user's quiz attempts"""
        attempts = QuizAttempt.objects.filter(student=request.user)
        quiz_id = request.query_params.get('quiz')
        if quiz_id:
            attempts = attempts.filter(quiz_id=quiz_id)
        serializer = self.get_serializer(attempts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def time_remaining(self, request, pk=None):
        """Get time remaining for quiz attempt"""
        attempt = self.get_object()

        if attempt.status != 'in_progress':
            return Response({'error': 'Attempt not in progress'}, status=400)

        time_limit_minutes = attempt.quiz.time_limit
        elapsed = (timezone.now() - attempt.started_at).total_seconds() / 60
        remaining = max(0, time_limit_minutes - elapsed)
        is_expired = remaining <= 0

        if is_expired and attempt.status == 'in_progress':
            attempt.status = 'timed_out'
            attempt.completed_at = timezone.now()
            attempt.save()

        return Response({
            'time_limit_minutes': time_limit_minutes,
            'elapsed_minutes': round(elapsed, 2),
            'remaining_minutes': round(remaining, 2),
            'is_expired': is_expired,
            'status': attempt.status
        })

    @action(detail=True, methods=['post'])
    def auto_submit(self, request, pk=None):
        """Auto-submit when time expires - scores 0 for unanswered questions"""
        attempt = self.get_object()

        if attempt.status != 'in_progress':
            return Response({'error': 'Attempt not in progress'}, status=400)

        time_limit = attempt.quiz.time_limit
        elapsed = (timezone.now() - attempt.started_at).total_seconds() / 60

        if elapsed < time_limit:
            return Response({
                'error': 'Time has not expired yet',
                'remaining_minutes': round(time_limit - elapsed, 2)
            }, status=400)

        questions = attempt.quiz.questions.all()
        answered_questions = QuizAnswer.objects.filter(attempt=attempt).values_list('question_id', flat=True)

        total_score = 0
        for question in questions:
            if question.id in answered_questions:
                answer = QuizAnswer.objects.get(attempt=attempt, question=question)
                total_score += answer.points_earned
            else:
                QuizAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    text_answer='',
                    is_correct=False,
                    points_earned=0
                )

        attempt.score = total_score
        attempt.percentage = (total_score / attempt.max_possible_score * 100) if attempt.max_possible_score > 0 else 0
        attempt.is_passed = attempt.percentage >= attempt.quiz.passing_score
        attempt.status = 'timed_out'
        attempt.completed_at = timezone.now()
        attempt.save()

        return Response(QuizAttemptSerializer(attempt).data)
