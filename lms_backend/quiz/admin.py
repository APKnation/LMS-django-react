from django.contrib import admin
from .models import Quiz, Question, Choice, QuizAttempt, QuizAnswer


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'time_limit', 'passing_score', 'max_attempts', 'created_at']
    list_filter = ['course', 'created_at']
    search_fields = ['title', 'course__title']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question', 'quiz', 'question_type', 'points', 'order']
    list_filter = ['quiz', 'question_type']
    search_fields = ['question']


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ['text', 'question', 'is_correct']
    list_filter = ['question__quiz']
    search_fields = ['text']


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['student', 'quiz', 'score', 'percentage', 'is_passed', 'status', 'attempt_number', 'started_at']
    list_filter = ['status', 'is_passed', 'started_at']
    search_fields = ['student__username', 'quiz__title']


@admin.register(QuizAnswer)
class QuizAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt', 'question', 'is_correct', 'points_earned']
    list_filter = ['is_correct']
    search_fields = ['attempt__student__username', 'question__question']
