from rest_framework import serializers
from .models import Progress, Bookmark, Note, Certificate
from courses.serializers import LessonSerializer, CourseSerializer


class ProgressSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    lesson_details = LessonSerializer(source='lesson', read_only=True)

    class Meta:
        model = Progress
        fields = ['id', 'student', 'student_name', 'lesson', 'lesson_details', 'completed', 'completed_at']
        read_only_fields = ['id', 'completed_at']


class ProgressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = ['id', 'lesson', 'completed']
        read_only_fields = ['id']


class BookmarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    lesson_details = LessonSerializer(source='lesson', read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'student', 'student_name', 'lesson', 'lesson_details', 'note', 'created_at']
        read_only_fields = ['id', 'created_at']


class BookmarkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'lesson', 'note']
        read_only_fields = ['id']


class NoteSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    lesson_details = LessonSerializer(source='lesson', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'student', 'student_name', 'lesson', 'lesson_details', 'content', 'timestamp', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'lesson', 'content', 'timestamp']
        read_only_fields = ['id']


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Certificate
        fields = ['id', 'student', 'student_name', 'course', 'course_details', 'certificate_number', 'issued_at', 'pdf_file']
        read_only_fields = ['id', 'issued_at', 'certificate_number']
