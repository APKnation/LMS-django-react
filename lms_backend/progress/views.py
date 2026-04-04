from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Progress
from .serializers import ProgressSerializer, ProgressCreateSerializer


class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ProgressCreateSerializer
        return ProgressSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        progress = Progress.objects.filter(student=request.user)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_complete(self, request):
        lesson_id = request.data.get('lesson')
        progress, created = Progress.objects.get_or_create(
            student=request.user,
            lesson_id=lesson_id,
            defaults={'completed': True}
        )
        if not created:
            progress.completed = True
            progress.save()
        serializer = self.get_serializer(progress)
        return Response(serializer.data)
