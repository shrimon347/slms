from course.controllers.views import (
    CompleteLessonAPIView,
    CompleteQuizAPIView,
    CourseCreateUpdateAPIView,
    CourseDetailView,
    CourseEnrollmentModuleLessonView,
    CourseListView,
)
from django.urls import path

urlpatterns = [
    path("", CourseListView.as_view(), name="course-list"),
    path("create/", CourseCreateUpdateAPIView.as_view(), name="course-create"),
     path("update/<int:course_id>/", CourseCreateUpdateAPIView.as_view(), name="update-course"),
    path("delete/<int:course_id>/", CourseCreateUpdateAPIView.as_view(), name="delete-course"),
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
