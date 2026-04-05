from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
import uuid
from .models import Progress, Bookmark, Note, Certificate
from .serializers import (
    ProgressSerializer, ProgressCreateSerializer,
    BookmarkSerializer, BookmarkCreateSerializer,
    NoteSerializer, NoteCreateSerializer,
    CertificateSerializer
)


class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ProgressCreateSerializer
        return ProgressSerializer

    def perform_create(self, serializer):
        if serializer.validated_data.get('completed'):
            serializer.save(student=self.request.user, completed_at=timezone.now())
        else:
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
            defaults={'completed': True, 'completed_at': timezone.now()}
        )
        if not created:
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
        serializer = self.get_serializer(progress)
        return Response(serializer.data)


class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return BookmarkCreateSerializer
        return BookmarkSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'])
    def my_bookmarks(self, request):
        bookmarks = Bookmark.objects.filter(student=request.user)
        serializer = self.get_serializer(bookmarks, many=True)
        return Response(serializer.data)


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return NoteCreateSerializer
        return NoteSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'])
    def my_notes(self, request):
        notes = Note.objects.filter(student=request.user)
        lesson_id = request.query_params.get('lesson')
        if lesson_id:
            notes = notes.filter(lesson_id=lesson_id)
        serializer = self.get_serializer(notes, many=True)
        return Response(serializer.data)


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Students only see their own certificates
        if not self.request.user.is_instructor:
            return Certificate.objects.filter(student=self.request.user)
        return Certificate.objects.all()

    @action(detail=False, methods=['post'])
    def generate(self, request):
        course_id = request.data.get('course')
        
        # Check if certificate already exists
        existing = Certificate.objects.filter(student=request.user, course_id=course_id).first()
        if existing:
            return Response({'error': 'Certificate already exists', 'certificate': CertificateSerializer(existing).data}, status=400)
        
        # Generate unique certificate number
        cert_number = f"CERT-{uuid.uuid4().hex[:8].upper()}"
        
        certificate = Certificate.objects.create(
            student=request.user,
            course_id=course_id,
            certificate_number=cert_number
        )
        serializer = self.get_serializer(certificate)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_certificates(self, request):
        certificates = Certificate.objects.filter(student=request.user)
        serializer = self.get_serializer(certificates, many=True)
        return Response(serializer.data)
