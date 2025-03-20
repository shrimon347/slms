from django.urls import path

from .controllers.views import (
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
]
