from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_student', 'is_instructor', 'is_instructor_approved']
        read_only_fields = ['id']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_student', 'is_instructor', 'is_instructor_approved']
        read_only_fields = ['id', 'is_instructor_approved']

    def create(self, validated_data):
        # If user is registering as instructor, set is_instructor_approved to False by default
        if validated_data.get('is_instructor', False):
            validated_data['is_instructor_approved'] = False
        user = User.objects.create_user(**validated_data)
        return user
