from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_student = models.BooleanField(default=True)
    is_instructor = models.BooleanField(default=False)
    is_instructor_approved = models.BooleanField(default=False, help_text="Whether the instructor account has been approved by an admin")