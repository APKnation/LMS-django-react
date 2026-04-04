from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course, Lesson
from .serializers import CourseSerializer, CourseCreateSerializer, LessonSerializer


class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsInstructor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseCreateSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = course.lessons.all().order_by('order')
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
