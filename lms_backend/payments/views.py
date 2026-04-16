import requests
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

CLICKPESA_API_KEY = getattr(settings, 'CLICKPESA_API_KEY', '')
CLICKPESA_CLIENT_ID = getattr(settings, 'CLICKPESA_CLIENT_ID', '')
CLICKPESA_API_URL = getattr(settings, 'CLICKPESA_API_URL', 'https://api.clickpesa.com')


def get_clickpesa_token():
    """Generate JWT token for ClickPesa API authentication"""
    try:
        headers = {
            'api-key': CLICKPESA_API_KEY,
            'client-id': CLICKPESA_CLIENT_ID
        }
        print(f"Generating ClickPesa token with URL: {CLICKPESA_API_URL}/third-parties/generate-token")
        print(f"API Key: {CLICKPESA_API_KEY[:10]}... (truncated)")
        print(f"Client ID: {CLICKPESA_CLIENT_ID}")
        
        response = requests.post(
            f'{CLICKPESA_API_URL}/third-parties/generate-token',
            headers=headers,
            timeout=30
        )
        
        print(f"Token generation response status: {response.status_code}")
        print(f"Token generation response body: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('token', '')
            # ClickPesa returns token with "Bearer " prefix, remove it to avoid duplicate
            if token.startswith('Bearer '):
                token = token[7:]  # Remove "Bearer " prefix
            print(f"Token generated successfully: {token[:20]}... (truncated)")
            return token
        else:
            print(f"Token generation failed with status {response.status_code}")
            return None
    except Exception as e:
        print(f"Error generating ClickPesa token: {str(e)}")
        return None


class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor


class IsInstructorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_instructor or request.user.is_staff)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInstructorOrAdmin()]
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
        payment_method = serializer.validated_data.pop('payment_method', 'card')
        mobile_money_phone = serializer.validated_data.pop('mobile_money_phone', '')
        mobile_money_account_name = serializer.validated_data.pop('mobile_money_account_name', '')

        original_price = course.price
        discount_amount = 0
        coupon = None

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
        try:
            order = self.get_object()

            if order.status == 'completed':
                return Response({'error': 'Order already completed'}, status=400)

            # Handle card payments with ClickPesa
            if order.payment_method == 'card':
                try:
                    # Generate JWT token for authentication
                    token = get_clickpesa_token()
                    if not token:
                        return Response({'error': 'Failed to generate authentication token'}, status=500)

                    # Create payment with ClickPesa using correct endpoint
                    headers = {
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json'
                    }

                    payment_data = {
                        'amount': str(order.final_price),
                        'currency': 'TZS',
                        'orderReference': f'ORDER-{order.id}',
                        'redirectUrl': f'http://localhost:3000/payment/confirmation/{order.id}',
                        'cancelUrl': f'http://localhost:3000/payment/cancel/{order.id}'
                    }

                    response = requests.post(
                        f'{CLICKPESA_API_URL}/third-parties/payments/card-payment',
                        json=payment_data,
                        headers=headers,
                        timeout=30
                    )

                    if response.status_code == 200 or response.status_code == 201:
                        payment_info = response.json()
                        order.clickpesa_payment_id = payment_info.get('reference') or payment_info.get('id')
                        order.save()

                        return Response({
                            'payment_url': payment_info.get('paymentUrl') or payment_info.get('payment_url'),
                            'payment_id': order.clickpesa_payment_id,
                            'order': OrderSerializer(order).data
                        })
                    else:
                        print(f"ClickPesa Card Payment Error: Status {response.status_code}, Response: {response.text}")
                        # Extract clean error message from ClickPesa response
                        error_message = response.text
                        try:
                            error_json = response.json()
                            if 'message' in error_json:
                                error_message = error_json['message']
                            elif 'error' in error_json:
                                error_message = error_json['error']
                        except:
                            pass
                        return Response({
                            'error': error_message
                        }, status=500)

                except requests.exceptions.RequestException as e:
                    print(f"ClickPesa Request Error: {str(e)}")
                    return Response({'error': f'ClickPesa connection error: {str(e)}'}, status=500)
                except Exception as e:
                    return Response({'error': f'Payment processing error: {str(e)}'}, status=500)

            # Handle mobile money payments with ClickPesa
            elif order.payment_method in ['mpesa', 'vodacom', 'tigopesa', 'airtel', 'halotel', 'ttcl']:
                try:
                    # Generate JWT token for authentication
                    token = get_clickpesa_token()
                    if not token:
                        return Response({'error': 'Failed to generate authentication token'}, status=500)

                    # Initiate the USSD-PUSH payment directly (skip preview due to 401 errors)
                    headers = {
                        'Authorization': f'Bearer {token}',
                        'Content-Type': 'application/json'
                    }

                    initiate_data = {
                        'amount': str(order.final_price),
                        'currency': 'TZS',
                        'orderReference': f'ORDER{order.id}',
                        'phoneNumber': order.mobile_money_phone,
                        'fetchSenderDetails': False
                    }

                    initiate_response = requests.post(
                        f'{CLICKPESA_API_URL}/third-parties/payments/initiate-ussd-push-request',
                        json=initiate_data,
                        headers=headers,
                        timeout=30
                    )

                    if initiate_response.status_code == 200 or initiate_response.status_code == 201:
                        payment_info = initiate_response.json()
                        order.clickpesa_payment_id = payment_info.get('reference') or payment_info.get('id')
                        order.save()

                        return Response({
                            'payment_id': order.clickpesa_payment_id,
                            'status': 'pending',
                            'message': 'Mobile money payment initiated. Please complete payment on your phone.',
                            'order': OrderSerializer(order).data
                        })
                    else:
                        print(f"ClickPesa Initiate Error: Status {initiate_response.status_code}, Response: {initiate_response.text}")
                        # Extract clean error message from ClickPesa response
                        error_message = initiate_response.text
                        try:
                            error_json = initiate_response.json()
                            if 'message' in error_json:
                                error_message = error_json['message']
                            elif 'error' in error_json:
                                error_message = error_json['error']
                        except:
                            pass
                        return Response({
                            'error': error_message
                        }, status=500)

                except requests.exceptions.RequestException as e:
                    print(f"ClickPesa Request Error: {str(e)}")
                    return Response({'error': f'ClickPesa connection error: {str(e)}'}, status=500)
                except Exception as e:
                    return Response({'error': f'Mobile money processing error: {str(e)}'}, status=500)

            else:
                return Response({'error': 'Invalid payment method'}, status=400)

        except Exception as e:
            return Response({'error': f'Checkout error: {str(e)}'}, status=500)

    @action(detail=False, methods=['post'])
    def confirm_payment(self, request):
        payment_id = request.data.get('payment_id')

        try:
            headers = {
                'Authorization': f'Bearer {CLICKPESA_API_KEY}',
                'Content-Type': 'application/json',
                'X-Client-Id': CLICKPESA_CLIENT_ID
            }

            # Check payment status with ClickPesa
            response = requests.get(
                f'{CLICKPESA_API_URL}/payments/{payment_id}',
                headers=headers
            )

            if response.status_code == 200:
                payment_info = response.json()
                order = Order.objects.get(clickpesa_payment_id=payment_id)

                if payment_info.get('status') == 'completed' or payment_info.get('status') == 'success':
                    order.status = 'completed'
                    order.completed_at = timezone.now()
                    order.save()

                    enrollment, created = Enrollment.objects.get_or_create(
                        student=order.student,
                        course=order.course,
                        defaults={'is_active': True}
                    )

                    self._update_revenue_analytics(order)

                    return Response({'success': True, 'order': OrderSerializer(order).data})
                elif payment_info.get('status') == 'failed' or payment_info.get('status') == 'cancelled':
                    order.status = 'failed'
                    order.save()
                    return Response({'success': False, 'status': payment_info.get('status')})
                else:
                    return Response({'success': False, 'status': payment_info.get('status'), 'message': 'Payment still processing'})
            else:
                return Response({'error': f'ClickPesa error: {response.text}'}, status=500)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)
        except Exception as e:
            return Response({'error': f'Payment confirmation error: {str(e)}'}, status=500)

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
