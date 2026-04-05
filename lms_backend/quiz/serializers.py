from rest_framework import serializers
from .models import Quiz, Question, Choice, QuizAttempt, QuizAnswer


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'question', 'text', 'is_correct']
        read_only_fields = ['id']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'question', 'question_type', 'correct_answer', 'points', 'order', 'choices']
        read_only_fields = ['id']


class QuestionWithoutAnswerSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'question_type', 'points', 'order', 'choices']
        read_only_fields = ['id']


class QuizSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'course', 'course_title', 'title', 'description', 'time_limit', 'passing_score', 'max_attempts', 'questions', 'question_count', 'created_at']
        read_only_fields = ['id', 'created_at']


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'course', 'title', 'description', 'time_limit', 'passing_score', 'max_attempts']
        read_only_fields = ['id']


class QuizAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question', read_only=True)

    class Meta:
        model = QuizAnswer
        fields = ['id', 'attempt', 'question', 'question_text', 'selected_choice', 'text_answer', 'is_correct', 'points_earned']
        read_only_fields = ['id', 'is_correct', 'points_earned']


class QuizAttemptSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    answers = QuizAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'student', 'student_name', 'quiz', 'quiz_title', 'started_at', 'completed_at', 'score', 'max_possible_score', 'percentage', 'is_passed', 'status', 'attempt_number', 'answers']
        read_only_fields = ['id', 'started_at', 'score', 'max_possible_score', 'percentage', 'is_passed', 'attempt_number']


class QuizAttemptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz']
        read_only_fields = ['id']


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField(required=False, allow_null=True)
    text_answer = serializers.CharField(required=False, allow_blank=True)


class QuizSubmitSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)
