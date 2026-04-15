from rest_framework import serializers
from .models import Order, Coupon, InstructorPayout


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'valid_from', 'valid_until', 'is_active']


class CouponCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'max_uses', 'valid_from', 'valid_until', 'is_active']


class OrderSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='student.username', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'student', 'student_name', 'course', 'course_title', 'coupon', 'original_price',
                  'discount_amount', 'final_price', 'payment_method', 'payment_method_display',
                  'mobile_money_phone', 'mobile_money_account_name', 'status', 'created_at', 'completed_at']
        read_only_fields = ['stripe_payment_intent_id', 'final_price']


class OrderCreateSerializer(serializers.ModelSerializer):
    payment_method = serializers.CharField(default='card')
    mobile_money_phone = serializers.CharField(required=False, allow_blank=True, default='')
    mobile_money_account_name = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model = Order
        fields = ['id', 'course', 'payment_method', 'mobile_money_phone', 'mobile_money_account_name']


class CheckoutSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    payment_method_id = serializers.CharField()


class InstructorPayoutSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)

    class Meta:
        model = InstructorPayout
        fields = ['id', 'instructor', 'instructor_name', 'amount', 'period_start', 'period_end',
                  'status', 'created_at', 'processed_at']
