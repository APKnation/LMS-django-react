from django.contrib import admin
from .models import Category, Course, Lesson, Comment, Announcement, Assignment, AssignmentSubmission, Review, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'category', 'difficulty', 'status', 'is_free', 'price', 'created_at']
    list_filter = ['difficulty', 'status', 'is_free', 'category', 'created_at']
    search_fields = ['title', 'description', 'instructor__username']
    date_hierarchy = 'created_at'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'duration']
    list_filter = ['course']
    search_fields = ['title', 'course__title']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson', 'submission_type', 'max_points', 'deadline', 'allow_late_submission']
    list_filter = ['submission_type', 'course', 'deadline']
    search_fields = ['title', 'course__title']


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['student', 'assignment', 'status', 'score', 'is_late', 'submitted_at']
    list_filter = ['status', 'is_late', 'submitted_at']
    search_fields = ['student__username', 'assignment__title']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'rating', 'content_preview', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['content', 'student__username', 'course__title']

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'content_preview', 'created_at', 'is_instructor_response']
    list_filter = ['is_instructor_response', 'created_at']
    search_fields = ['content', 'user__username', 'lesson__title']

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'instructor', 'created_at', 'is_pinned']
    list_filter = ['is_pinned', 'created_at']
    search_fields = ['title', 'content']