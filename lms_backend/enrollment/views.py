from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Enrollment
from .serializers import EnrollmentSerializer, EnrollmentCreateSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

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
