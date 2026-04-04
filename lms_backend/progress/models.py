from django.db import models
from django.conf import settings
from courses.models import Lesson

User = settings.AUTH_USER_MODEL

class Progress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)