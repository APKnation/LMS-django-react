"""
URL configuration for lms_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import UserViewSet
from courses.views import (
    CourseViewSet, LessonViewSet, CategoryViewSet,
    CommentViewSet, AnnouncementViewSet, AssignmentViewSet, AssignmentSubmissionViewSet,
    ReviewViewSet
)
from enrollment.views import EnrollmentViewSet
from quiz.views import QuizViewSet, QuestionViewSet, ChoiceViewSet, QuizAttemptViewSet
from progress.views import (
    ProgressViewSet, BookmarkViewSet, NoteViewSet, CertificateViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'choices', ChoiceViewSet)
router.register(r'quiz-attempts', QuizAttemptViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'assignment-submissions', AssignmentSubmissionViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'progress', ProgressViewSet)
router.register(r'bookmarks', BookmarkViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'certificates', CertificateViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'announcements', AnnouncementViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
