from django.contrib import admin
from .models import Coupon, Order, InstructorPayout, RevenueAnalytics


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'times_used', 'max_uses', 'is_active', 'valid_until']
    list_filter = ['discount_type', 'is_active', 'valid_until']
    search_fields = ['code']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'student', 'course', 'final_price', 'status', 'created_at', 'completed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['student__username', 'course__title']


@admin.register(InstructorPayout)
class InstructorPayoutAdmin(admin.ModelAdmin):
    list_display = ['instructor', 'amount', 'status', 'created_at', 'processed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['instructor__username']


@admin.register(RevenueAnalytics)
class RevenueAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['course', 'date', 'sales_count', 'revenue', 'instructor_payout']
    list_filter = ['date']
    search_fields = ['course__title']
