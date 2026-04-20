from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserCreateSerializer


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # Allow anyone to register (create user), but require auth for other actions
        if self.action == 'create':
            return [permissions.AllowAny()]
        # Admin actions require staff permission
        if self.action in ['approve_instructor', 'ban_user', 'unban_user', 'update_role', 'delete_user']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def instructors(self, request):
        instructors = User.objects.filter(is_instructor=True)
        serializer = self.get_serializer(instructors, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def students(self, request):
        students = User.objects.filter(is_student=True)
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve_instructor(self, request, pk=None):
        """Approve an instructor account"""
        user = self.get_object()
        if not user.is_instructor:
            return Response({'error': 'User is not an instructor'}, status=400)
        
        user.is_instructor_approved = True
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def ban_user(self, request, pk=None):
        """Ban a user account"""
        user = self.get_object()
        if user.id == request.user.id:
            return Response({'error': 'Cannot ban yourself'}, status=400)
        
        user.is_active = False
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def unban_user(self, request, pk=None):
        """Unban a user account"""
        user = self.get_object()
        user.is_active = True
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_role(self, request, pk=None):
        """Update user roles"""
        user = self.get_object()
        if user.id == request.user.id:
            return Response({'error': 'Cannot modify your own role'}, status=400)
        
        role = request.data.get('role')
        if role == 'student':
            user.is_student = True
            user.is_instructor = False
            user.is_instructor_approved = False
            user.is_staff = False
        elif role == 'instructor':
            user.is_student = False
            user.is_instructor = True
            user.is_instructor_approved = False
            user.is_staff = False
        elif role == 'admin':
            user.is_student = False
            user.is_instructor = False
            user.is_staff = True
        else:
            return Response({'error': 'Invalid role'}, status=400)
        
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def delete_user(self, request, pk=None):
        """Delete a user account"""
        user = self.get_object()
        if user.id == request.user.id:
            return Response({'error': 'Cannot delete yourself'}, status=400)
        
        user.delete()
        return Response({'success': True}, status=204)
