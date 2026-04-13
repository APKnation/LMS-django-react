from rest_framework import serializers
from .models import Enrollment
from courses.serializers import CourseSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_description = serializers.CharField(source='course.description', read_only=True)
    course_instructor = serializers.CharField(source='course.instructor.username', read_only=True)
    course_difficulty = serializers.CharField(source='course.difficulty', read_only=True)
    course_is_free = serializers.BooleanField(source='course.is_free', read_only=True)
    course_price = serializers.CharField(source='course.price', read_only=True)
    course_thumbnail = serializers.CharField(source='course.thumbnail', read_only=True)
    course_created_at = serializers.DateTimeField(source='course.created_at', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_name', 'course_id', 'course_title', 
            'course_description', 'course_instructor', 'course_difficulty', 
            'course_is_free', 'course_price', 'course_thumbnail', 'course_created_at', 
            'enrolled_at', 'is_active'
        ]
        read_only_fields = ['id', 'enrolled_at']


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course']
        read_only_fields = ['id']
