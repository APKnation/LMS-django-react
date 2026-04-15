from rest_framework import serializers
from .models import Course, Lesson, Category, Comment, Announcement, Assignment, AssignmentSubmission, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'video', 'order', 'duration']
        read_only_fields = ['id']


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    instructor_id = serializers.IntegerField(source='instructor.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)
    total_duration = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor', 'instructor_name', 'instructor_id',
            'category', 'category_name', 'thumbnail', 'difficulty', 'status',
            'is_free', 'price', 'created_at', 'updated_at',
            'lessons', 'lesson_count', 'total_duration'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_duration(self, obj):
        return sum(lesson.duration for lesson in obj.lessons.all())


class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category',
            'thumbnail', 'difficulty', 'status', 'is_free', 'price'
        ]
        read_only_fields = ['id']


class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor_name',
            'category', 'category_name', 'thumbnail', 'difficulty',
            'is_free', 'price', 'created_at', 'lesson_count'
        ]
        read_only_fields = ['id', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'lesson', 'user', 'user_name', 'content', 'parent', 'replies',
                  'created_at', 'updated_at', 'is_instructor_response']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_instructor_response']

    def get_replies(self, obj):
        if hasattr(obj, 'replies'):
            return CommentSerializer(obj.replies.all(), many=True).data
        return []


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'lesson', 'content', 'parent']
        read_only_fields = ['id']


class AnnouncementSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'course', 'instructor', 'instructor_name', 'title', 'content',
                  'created_at', 'updated_at', 'is_pinned']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AnnouncementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'is_pinned']
        read_only_fields = ['id']


class AssignmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'course', 'course_title', 'lesson', 'lesson_title', 'title', 'description',
                  'submission_type', 'max_points', 'deadline', 'allow_late_submission', 'created_at']
        read_only_fields = ['id', 'created_at']


class AssignmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'course', 'lesson', 'title', 'description', 'submission_type',
                  'max_points', 'deadline', 'allow_late_submission']
        read_only_fields = ['id']


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = ['id', 'assignment', 'assignment_title', 'student', 'student_name',
                  'submission_file', 'submission_text', 'submission_link', 'submitted_at',
                  'score', 'feedback', 'status', 'is_late']
        read_only_fields = ['id', 'submitted_at', 'is_late']


class AssignmentSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ['id', 'assignment', 'submission_file', 'submission_text', 'submission_link']
        read_only_fields = ['id']


class GradeSubmissionSerializer(serializers.Serializer):
    score = serializers.DecimalField(max_digits=5, decimal_places=2)
    feedback = serializers.CharField(required=False, allow_blank=True)


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'course', 'course_title', 'student', 'student_name', 'rating', 'content', 'created_at']
        read_only_fields = ['id', 'created_at', 'student']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'course', 'rating', 'content']
        read_only_fields = ['id']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value
