from rest_framework import serializers
from .models import Enrollment
from courses.serializers import CourseSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'course', 'course_details', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']


class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course']
        read_only_fields = ['id']
