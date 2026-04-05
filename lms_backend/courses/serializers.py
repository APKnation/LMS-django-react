from rest_framework import serializers
from .models import Course, Lesson, Category


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
