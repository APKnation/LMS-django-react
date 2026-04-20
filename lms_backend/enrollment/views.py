from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Enrollment
from .serializers import EnrollmentSerializer, EnrollmentCreateSerializer


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['admin_list', 'admin_delete', 'cancel_enrollment']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Admins can see all enrollments, others only their own
        if self.request.user.is_staff:
            return Enrollment.objects.all()
        return Enrollment.objects.filter(student=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return EnrollmentCreateSerializer
        return EnrollmentSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'])
    def my_enrollments(self, request):
        enrollments = Enrollment.objects.filter(student=request.user)
        serializer = self.get_serializer(enrollments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def admin_list(self, request):
        """Admin endpoint to list all enrollments"""
        enrollments = Enrollment.objects.all()
        serializer = self.get_serializer(enrollments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], permission_classes=[IsAdmin])
    def admin_delete(self, request, pk=None):
        """Admin endpoint to delete any enrollment"""
        enrollment = self.get_object()
        enrollment.delete()
        return Response({'success': True}, status=204)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def cancel_enrollment(self, request, pk=None):
        """Admin endpoint to cancel an enrollment"""
        enrollment = self.get_object()
        enrollment.is_active = False
        enrollment.status = 'cancelled'
        enrollment.save()
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data)
