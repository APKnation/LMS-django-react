from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

User = settings.AUTH_USER_MODEL

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.thumbnail:
            # Validate thumbnail file size (max 5MB)
            if self.thumbnail.size > 5 * 1024 * 1024:
                raise ValidationError('Thumbnail file size cannot exceed 5MB.')

    def __str__(self):
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    video = models.FileField(upload_to='lessons/', blank=True, null=True)
    order = models.IntegerField()

    def __str__(self):
        return self.title