from rest_framework import serializers
from .models import Progress
from courses.serializers import LessonSerializer


class ProgressSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    lesson_details = LessonSerializer(source='lesson', read_only=True)

    class Meta:
        model = Progress
        fields = ['id', 'student', 'student_name', 'lesson', 'lesson_details', 'completed']
        read_only_fields = ['id']


class ProgressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'student', 'lesson', 'completed']
        read_only_fields = ['id']
