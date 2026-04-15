import stripe
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from courses.models import Course
from enrollment.models import Enrollment
from .models import Order, Coupon, InstructorPayout, RevenueAnalytics
from .serializers import (
    OrderSerializer, OrderCreateSerializer, CheckoutSerializer,
    CouponSerializer, CouponCreateSerializer, InstructorPayoutSerializer
)

stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')


class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'create':
            return CouponCreateSerializer
        return CouponSerializer

    @action(detail=False, methods=['post'])
    def validate(self, request):
        code = request.data.get('code')
        course_id = request.data.get('course_id')

        if not code:
            return Response({'error': 'Coupon code required'}, status=400)

        try:
            coupon = Coupon.objects.get(code=code.upper(), is_active=True)
            if not coupon.is_valid():
                return Response({'valid': False, 'error': 'Coupon expired or max uses reached'})

            discount = 0
            if course_id:
                course = Course.objects.get(id=course_id)
                discount = coupon.calculate_discount(course.price)

            return Response({
                'valid': True,
                'coupon': CouponSerializer(coupon).data,
                'discount_amount': str(discount)
            })
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'error': 'Invalid coupon code'})
        except Course.DoesNotExist:
            return Response({'valid': False, 'error': 'Course not found'})


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        coupon_code = serializer.validated_data.pop('coupon_code', None)
        payment_method = serializer.validated_data.pop('payment_method', 'card')
        mobile_money_phone = serializer.validated_data.pop('mobile_money_phone', '')
        mobile_money_account_name = serializer.validated_data.pop('mobile_money_account_name', '')

        original_price = course.price
        discount_amount = 0
        coupon = None

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper(), is_active=True)
                if coupon.is_valid():
                    discount_amount = coupon.calculate_discount(original_price)
                    coupon.times_used += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                pass

        final_price = original_price - discount_amount

        order = serializer.save(
            student=self.request.user,
            original_price=original_price,
            discount_amount=discount_amount,
            final_price=final_price,
            coupon=coupon,
            payment_method=payment_method,
            mobile_money_phone=mobile_money_phone,
            mobile_money_account_name=mobile_money_account_name
        )
        return order

    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        order = self.get_object()

        if order.status == 'completed':
            return Response({'error': 'Order already completed'})

        # Handle mobile money payments
        if order.payment_method != 'card':
            # For mobile money, simulate payment processing
            # In production, integrate with actual mobile money APIs
            from django.utils import timezone
            order.status = 'completed'
            order.completed_at = timezone.now()
            order.save()

            # Create enrollment
            enrollment, created = Enrollment.objects.get_or_create(
                student=order.student,
                course=order.course,
                defaults={'status': 'active'}
            )

            # Update revenue analytics
            RevenueAnalytics.objects.update_or_create(
                course=order.course,
                date=timezone.now().date(),
                defaults={
                    'sales_count': 1,
                    'revenue': order.final_price,
                    'instructor_payout': order.final_price * 0.7  # 70% to instructor
                }
            )

            return Response({
                'success': True,
                'message': f'Payment completed via {order.get_payment_method_display()}',
                'order_id': order.id,
                'payment_method': order.payment_method
            })

        # Handle card payments with Stripe
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(order.final_price * 100),
                currency='tzs',
                metadata={
                    'order_id': order.id,
                    'course_id': order.course.id,
                    'student_id': request.user.id
                }
            )

            order.stripe_payment_intent_id = intent.id
            order.save()

            return Response({
                'client_secret': intent.client_secret,
                'order': OrderSerializer(order).data
            })
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=False, methods=['post'])
    def confirm_payment(self, request):
        intent_id = request.data.get('payment_intent_id')

        try:
            intent = stripe.PaymentIntent.retrieve(intent_id)
            order = Order.objects.get(stripe_payment_intent_id=intent_id)

            if intent.status == 'succeeded':
                order.status = 'completed'
                order.completed_at = timezone.now()
                order.save()

                Enrollment.objects.get_or_create(
                    student=order.student,
                    course=order.course,
                    defaults={'status': 'active'}
                )

                self._update_revenue_analytics(order)

                return Response({'success': True, 'order': OrderSerializer(order).data})
            else:
                order.status = 'failed'
                order.save()
                return Response({'success': False, 'status': intent.status})
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=400)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

    def _update_revenue_analytics(self, order):
        from datetime import date
        today = date.today()
        analytics, created = RevenueAnalytics.objects.get_or_create(
            course=order.course,
            date=today,
            defaults={
                'sales_count': 1,
                'revenue': order.final_price,
                'instructor_payout': order.final_price * 0.7
            }
        )
        if not created:
            analytics.sales_count += 1
            analytics.revenue += order.final_price
            analytics.instructor_payout += order.final_price * 0.7
            analytics.save()

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        orders = Order.objects.filter(student=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class InstructorPayoutViewSet(viewsets.ModelViewSet):
    queryset = InstructorPayout.objects.all()
    serializer_class = InstructorPayoutSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        if self.request.user.is_staff:
            return InstructorPayout.objects.all()
        return InstructorPayout.objects.filter(instructor=self.request.user)

    @action(detail=False, methods=['get'])
    def my_payouts(self, request):
        payouts = InstructorPayout.objects.filter(instructor=request.user)
        serializer = self.get_serializer(payouts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def revenue_summary(self, request):
        from datetime import date, timedelta
        from django.db.models import Sum

        end_date = date.today()
        start_date = end_date - timedelta(days=30)

        orders = Order.objects.filter(
            course__instructor=request.user,
            status='completed',
            completed_at__date__gte=start_date,
            completed_at__date__lte=end_date
        )

        total_revenue = orders.aggregate(total=Sum('final_price'))['total'] or 0
        total_sales = orders.count()

        daily_data = []
        for i in range(30):
            day = end_date - timedelta(days=i)
            day_orders = orders.filter(completed_at__date=day)
            day_revenue = day_orders.aggregate(total=Sum('final_price'))['total'] or 0
            daily_data.append({
                'date': day.isoformat(),
                'revenue': str(day_revenue),
                'sales': day_orders.count()
            })

        return Response({
            'total_revenue': str(total_revenue),
            'total_sales': total_sales,
            'period': f'{start_date} to {end_date}',
            'daily_breakdown': list(reversed(daily_data))
        })


class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        if not request.user.is_instructor and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=403)

        from datetime import date, timedelta
        from django.db.models import Sum, Count

        end_date = date.today()
        start_date = end_date - timedelta(days=30)

        orders = Order.objects.filter(
            course__instructor=request.user,
            status='completed',
            completed_at__date__gte=start_date,
            completed_at__date__lte=end_date
        )

        total_revenue = orders.aggregate(total=Sum('final_price'))['total'] or 0
        total_sales = orders.count()
        total_students = Enrollment.objects.filter(course__instructor=request.user).count()

        course_stats = []
        for course in Course.objects.filter(instructor=request.user):
            course_orders = orders.filter(course=course)
            course_revenue = course_orders.aggregate(total=Sum('final_price'))['total'] or 0
            course_stats.append({
                'course_id': course.id,
                'course_title': course.title,
                'revenue': str(course_revenue),
                'sales': course_orders.count()
            })

        return Response({
            'total_revenue': str(total_revenue),
            'total_sales': total_sales,
            'total_students': total_students,
            'course_stats': course_stats
        })
