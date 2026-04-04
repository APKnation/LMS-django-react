from django.db import models
from courses.models import Course

class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)