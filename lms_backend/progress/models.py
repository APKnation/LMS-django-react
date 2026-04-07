from django.db import models
from django.conf import settings
from courses.models import Lesson, Course

User = settings.AUTH_USER_MODEL


class Progress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_watched_at = models.DateTimeField(auto_now=True)
    last_timestamp = models.PositiveIntegerField(default=0, help_text="Video timestamp in seconds for resuming")

    class Meta:
        unique_together = ['student', 'lesson']

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"


class Bookmark(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='bookmarked_by')
    note = models.TextField(blank=True, help_text="Optional note about this bookmark")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'lesson']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username} bookmarked {self.lesson.title}"


class Note(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_notes')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()
    timestamp = models.PositiveIntegerField(default=0, help_text="Video timestamp in seconds")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Note by {self.student.username} on {self.lesson.title}"


class Certificate(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    certificate_number = models.CharField(max_length=50, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to='certificates/', null=True, blank=True)

    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-issued_at']

    def __str__(self):
        return f"Certificate for {self.student.username} - {self.course.title}"