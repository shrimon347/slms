from django.urls import path

from .controllers.views import (
    CompleteLessonAPIView,
    CompleteQuizAPIView,
    CourseDetailView,
    CourseEnrollmentModuleLessonView,
    CourseListView,
)

urlpatterns = [
    path("", CourseListView.as_view(), name="course-list"),
    path("<slug:slug>/", CourseDetailView.as_view(), name="course-detail"),
    path(
        "enrollments/<uuid:enrollment_id>/",
        CourseEnrollmentModuleLessonView.as_view(),
        name="enrollment-detail",
    ),
    path(
        "<uuid:enrollment_id>/module/complete-lesson/<int:lesson_id>/",
        CompleteLessonAPIView.as_view(),
        name="complete-lesson",
    ),
    path(
        "<uuid:enrollment_id>/module/complete-quiz/<int:quiz_id>/",
        CompleteQuizAPIView.as_view(),
        name="complete-quiz",
    ),
]
