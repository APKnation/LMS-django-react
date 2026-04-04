from rest_framework import serializers
from .models import Course, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'video', 'order']
        read_only_fields = ['id']


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.IntegerField(source='lessons.count', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor', 'instructor_name', 'thumbnail', 'created_at', 'lessons', 'lesson_count']
        read_only_fields = ['id', 'created_at']


class CourseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'thumbnail']
        read_only_fields = ['id']
