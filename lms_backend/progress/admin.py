from django.contrib import admin
from .models import Progress


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'completed']
    list_filter = ['completed', 'lesson__course']
    search_fields = ['student__username', 'lesson__title']
