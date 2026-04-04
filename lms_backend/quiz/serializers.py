from rest_framework import serializers
from .models import Quiz, Question, Choice


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'question', 'text']
        read_only_fields = ['id']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'question', 'correct_answer', 'choices']
        read_only_fields = ['id']


class QuizSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'course', 'course_title', 'questions', 'question_count']
        read_only_fields = ['id']


class QuizCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'course']
        read_only_fields = ['id']
