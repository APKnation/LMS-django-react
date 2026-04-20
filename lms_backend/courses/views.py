from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from django.utils import timezone
from enrollment.models import Enrollment
from progress.models import Progress
from .models import Course, Lesson, Category, Comment, Announcement, Assignment, AssignmentSubmission, Review
from .serializers import (
    CourseSerializer, CourseCreateSerializer, CourseListSerializer,
    LessonSerializer, CategorySerializer, CommentSerializer, CommentCreateSerializer,
    AnnouncementSerializer, AnnouncementCreateSerializer,
    AssignmentSerializer, AssignmentCreateSerializer,
    AssignmentSubmissionSerializer, AssignmentSubmissionCreateSerializer,
    GradeSubmissionSerializer, ReviewSerializer, ReviewCreateSerializer
)


class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(status='published')
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'instructor', 'is_free']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        # Admins can see all courses, others only published
        if self.request.user.is_staff:
            queryset = Course.objects.all()
        else:
            queryset = Course.objects.filter(status='published')

        # Filter by instructor username
        instructor = self.request.query_params.get('instructor_name')
        if instructor:
            queryset = queryset.filter(instructor__username__icontains=instructor)

        # Filter by category name
        category_name = self.request.query_params.get('category_name')
        if category_name:
            queryset = queryset.filter(category__name__icontains=category_name)

        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def get_permissions(self):
        if self.action == 'create':
            return [IsInstructor()]
        if self.action in ['admin_list', 'admin_delete', 'change_status']:
            return [IsAdmin()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseCreateSerializer
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = course.lessons.all().order_by('order')
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        courses = Course.objects.filter(instructor=request.user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[IsInstructor])
    def students(self, request, pk=None):
        from enrollment.models import Enrollment
        course = self.get_object()

        # Check if user is the instructor of this course
        if course.instructor != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=403)

        enrollments = Enrollment.objects.filter(course=course, is_active=True)
        students_data = []
        for enrollment in enrollments:
            students_data.append({
                'id': enrollment.student.id,
                'username': enrollment.student.username,
                'email': enrollment.student.email,
                'first_name': enrollment.student.first_name,
                'last_name': enrollment.student.last_name,
                'enrolled_at': enrollment.enrolled_at,
                'is_active': enrollment.is_active
            })

        return Response(students_data)

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsInstructor])
    def announcements(self, request, pk=None):
        course = self.get_object()

        # Check if user is the instructor of this course
        if course.instructor != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=403)

        if request.method == 'GET':
            announcements = course.announcements.all().order_by('-created_at')
            from .serializers import AnnouncementSerializer
            serializer = AnnouncementSerializer(announcements, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            from .serializers import AnnouncementCreateSerializer
            serializer = AnnouncementCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(course=course, instructor=request.user)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        from enrollment.models import Enrollment
        course = self.get_object()
        
        # Check if already enrolled
        existing_enrollment = Enrollment.objects.filter(student=request.user, course=course).first()
        if existing_enrollment:
            return Response({
                'success': True,
                'message': 'Already enrolled in this course',
                'enrollment_id': existing_enrollment.id
            })
        
        # Create enrollment
        enrollment = Enrollment.objects.create(
            student=request.user,
            course=course,
            status='active'
        )
        
        return Response({
            'success': True,
            'message': 'Successfully enrolled in course',
            'enrollment_id': enrollment.id
        })

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        courses = Course.objects.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        ).filter(status='published')
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[IsInstructor])
    def analytics(self, request, pk=None):
        course = self.get_object()

        # Only allow instructor of the course to view analytics
        if course.instructor != request.user:
            return Response({'error': 'Permission denied'}, status=403)

        total_lessons = course.lessons.count()
        total_enrollments = Enrollment.objects.filter(course=course).count()

        # Completion stats
        progress_data = Progress.objects.filter(lesson__course=course)
        completed_lessons = progress_data.filter(completed=True).count()

        # Students who completed all lessons
        students_with_progress = progress_data.values('student').distinct().count()

        # Average completion rate per student
        if total_enrollments > 0 and total_lessons > 0:
            avg_completion_rate = (completed_lessons / (total_enrollments * total_lessons)) * 100
        else:
            avg_completion_rate = 0
        
        data = {
            'course_id': course.id,
            'course_title': course.title,
            'total_lessons': total_lessons,
            'total_enrollments': total_enrollments,
            'completed_lessons_count': completed_lessons,
            'students_with_progress': students_with_progress,
            'average_completion_rate': round(avg_completion_rate, 2),
            'revenue': float(course.price * total_enrollments) if not course.is_free else 0
        }
        return Response(data)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        # Check if user is the instructor of the lesson's course
        lesson = serializer.validated_data.get('lesson')
        is_instructor = lesson.course.instructor == self.request.user
        serializer.save(user=self.request.user, is_instructor_response=is_instructor)

    @action(detail=False, methods=['get'])
    def lesson_comments(self, request):
        lesson_id = request.query_params.get('lesson')
        if lesson_id:
            comments = Comment.objects.filter(lesson_id=lesson_id, parent=None)
            serializer = self.get_serializer(comments, many=True)
            return Response(serializer.data)
        return Response({'error': 'lesson parameter required'}, status=400)


class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInstructor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'create':
            return AnnouncementCreateSerializer
        return AnnouncementSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=False, methods=['get'])
    def course_announcements(self, request):
        course_id = request.query_params.get('course')
        if course_id:
            announcements = Announcement.objects.filter(course_id=course_id)
            serializer = self.get_serializer(announcements, many=True)
            return Response(serializer.data)
        return Response({'error': 'course parameter required'}, status=400)


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInstructor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'create':
            return AssignmentCreateSerializer
        return AssignmentSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def course_assignments(self, request):
        course_id = request.query_params.get('course')
        if course_id:
            assignments = Assignment.objects.filter(course_id=course_id)
            serializer = self.get_serializer(assignments, many=True)
            return Response(serializer.data)
        return Response({'error': 'course parameter required'}, status=400)


class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = AssignmentSubmission.objects.all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return AssignmentSubmissionCreateSerializer
        return AssignmentSubmissionSerializer

    def get_queryset(self):
        # Students see their own submissions, instructors see all for their courses
        if not self.request.user.is_instructor:
            return AssignmentSubmission.objects.filter(student=self.request.user)
        return AssignmentSubmission.objects.filter(assignment__course__instructor=self.request.user)

    def perform_create(self, serializer):
        assignment = serializer.validated_data.get('assignment')
        
        # Check if deadline has passed
        is_late = False
        if timezone.now() > assignment.deadline:
            if not assignment.allow_late_submission:
                return Response({'error': 'Submission deadline has passed'}, status=400)
            is_late = True
        
        serializer.save(student=self.request.user, is_late=is_late)

    @action(detail=True, methods=['post'], permission_classes=[IsInstructor])
    def grade(self, request, pk=None):
        """Grade an assignment submission"""
        submission = self.get_object()
        
        # Check if instructor owns the course
        if submission.assignment.course.instructor != request.user:
            return Response({'error': 'Permission denied'}, status=403)
        
        serializer = GradeSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        submission.score = serializer.validated_data['score']
        submission.feedback = serializer.validated_data.get('feedback', '')
        submission.status = 'graded'
        submission.save()
        
        return Response(AssignmentSubmissionSerializer(submission).data)

    @action(detail=False, methods=['get'])
    def my_submissions(self, request):
        """Get current user's submissions"""
        submissions = AssignmentSubmission.objects.filter(student=request.user)
        assignment_id = request.query_params.get('assignment')
        if assignment_id:
            submissions = submissions.filter(assignment_id=assignment_id)
        serializer = self.get_serializer(submissions, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset.select_related('student', 'course')

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get current user's reviews"""
        reviews = Review.objects.filter(student=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def course_reviews(self, request):
        """Get reviews for a specific course with average rating"""
        course_id = request.query_params.get('course')
        if not course_id:
            return Response({'error': 'course parameter required'}, status=400)

        reviews = Review.objects.filter(course_id=course_id)
        avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']

        serializer = self.get_serializer(reviews, many=True)
        return Response({
            'reviews': serializer.data,
            'average_rating': round(avg_rating or 0, 1),
            'total_reviews': reviews.count()
        })
