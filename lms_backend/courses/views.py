from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Course, Lesson, Category
from .serializers import (
    CourseSerializer, CourseCreateSerializer, CourseListSerializer,
    LessonSerializer, CategorySerializer
)


class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(status='published')
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'instructor', 'is_free']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Course.objects.filter(status='published')
        
        # Filter by instructor username
        instructor = self.request.query_params.get('instructor_name')
        if instructor:
            queryset = queryset.filter(instructor__username__icontains=instructor)
        
        # Filter by category name
        category_name = self.request.query_params.get('category_name')
        if category_name:
            queryset = queryset.filter(category__name__icontains=category_name)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

    def get_permissions(self):
        if self.action == 'create':
            return [IsInstructor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'create':
            return CourseCreateSerializer
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        course = self.get_object()
        lessons = course.lessons.all().order_by('order')
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        courses = Course.objects.filter(instructor=request.user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        courses = Course.objects.filter(
            Q(title__icontains=query) | 
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        ).filter(status='published')
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
