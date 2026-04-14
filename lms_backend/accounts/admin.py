from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_student', 'is_instructor', 'is_instructor_approved', 'is_staff']
    list_filter = ['is_student', 'is_instructor', 'is_instructor_approved', 'is_staff', 'is_superuser']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role', {'fields': ('is_student', 'is_instructor', 'is_instructor_approved')}),
    )
    
    actions = ['approve_instructors', 'reject_instructors']
    
    def approve_instructors(self, request, queryset):
        updated = queryset.filter(is_instructor=True).update(is_instructor_approved=True)
        self.message_user(request, f'{updated} instructor(s) approved successfully.', messages.SUCCESS)
    approve_instructors.short_description = 'Approve selected instructors'
    
    def reject_instructors(self, request, queryset):
        updated = queryset.filter(is_instructor=True).update(is_instructor_approved=False)
        # Optionally remove instructor status
        # updated += queryset.filter(is_instructor=True).update(is_instructor=False)
        self.message_user(request, f'{updated} instructor(s) rejected.', messages.WARNING)
    reject_instructors.short_description = 'Reject selected instructors'
