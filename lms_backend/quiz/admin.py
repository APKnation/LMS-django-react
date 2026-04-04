from django.contrib import admin
from .models import Quiz, Question, Choice


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['id', 'course']
    list_filter = ['course']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question', 'quiz', 'correct_answer']
    list_filter = ['quiz']
    search_fields = ['question']


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ['text', 'question']
    list_filter = ['question__quiz']
    search_fields = ['text']
