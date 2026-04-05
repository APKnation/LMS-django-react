from django.contrib import admin
from .models import Progress, Bookmark, Note, Certificate


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'completed', 'completed_at']
    list_filter = ['completed', 'lesson__course']
    search_fields = ['student__username', 'lesson__title']


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'created_at']
    list_filter = ['created_at']
    search_fields = ['student__username', 'lesson__title']


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'content_preview', 'timestamp', 'created_at']
    list_filter = ['created_at']
    search_fields = ['student__username', 'lesson__title', 'content']

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'certificate_number', 'issued_at']
    list_filter = ['issued_at']
    search_fields = ['student__username', 'course__title', 'certificate_number']
