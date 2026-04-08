from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.http import FileResponse
from django.conf import settings
import uuid
import os
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
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

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download certificate as PDF"""
        certificate = self.get_object()

        if not certificate.pdf_file:
            self.generate_pdf_certificate(certificate)

        if certificate.pdf_file and os.path.exists(certificate.pdf_file.path):
            return FileResponse(
                open(certificate.pdf_file.path, 'rb'),
                as_attachment=True,
                filename=f"certificate_{certificate.certificate_number}.pdf"
            )
        return Response({'error': 'PDF not found'}, status=404)

    def generate_pdf_certificate(self, certificate):
        """Generate PDF certificate using ReportLab"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=landscape(letter),
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=36,
            textColor=colors.HexColor('#1a365d'),
            spaceAfter=30,
            alignment=1
        )
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=18,
            textColor=colors.HexColor('#4a5568'),
            spaceAfter=20,
            alignment=1
        )
        name_style = ParagraphStyle(
            'NameStyle',
            parent=styles['Heading2'],
            fontSize=28,
            textColor=colors.HexColor('#2d3748'),
            spaceAfter=15,
            alignment=1
        )

        story = []

        story.append(Paragraph("CERTIFICATE", title_style))
        story.append(Paragraph("OF COMPLETION", title_style))
        story.append(Spacer(1, 30))

        story.append(Paragraph("This certifies that", subtitle_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph(certificate.student.get_full_name() or certificate.student.username, name_style))
        story.append(Spacer(1, 20))

        story.append(Paragraph(f"has successfully completed", subtitle_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph(certificate.course.title, title_style))
        story.append(Spacer(1, 40))

        data = [
            [f"Certificate ID: {certificate.certificate_number}", f"Date: {certificate.issued_at.strftime('%B %d, %Y')}"]
        ]
        table = Table(data, colWidths=[300, 300])
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#4a5568')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
        ]))
        story.append(table)

        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()

        filename = f"certificate_{certificate.certificate_number}.pdf"
        filepath = os.path.join(settings.MEDIA_ROOT, 'certificates', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        with open(filepath, 'wb') as f:
            f.write(pdf)

        certificate.pdf_file.name = f'certificates/{filename}'
        certificate.save()

        return filepath

    @action(detail=False, methods=['get'])
    def verify(self, request):
        """Verify certificate by certificate number"""
        cert_number = request.query_params.get('certificate_number')
        if not cert_number:
            return Response({'error': 'certificate_number parameter required'}, status=400)

        try:
            certificate = Certificate.objects.get(certificate_number=cert_number)
            return Response({
                'valid': True,
                'certificate': {
                    'certificate_number': certificate.certificate_number,
                    'student_name': certificate.student.get_full_name() or certificate.student.username,
                    'course_title': certificate.course.title,
                    'issued_at': certificate.issued_at,
                }
            })
        except Certificate.DoesNotExist:
            return Response({'valid': False, 'error': 'Certificate not found'}, status=404)
