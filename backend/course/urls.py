from .controllers.views import CourseDetailView, CourseListView
from django.urls import path

urlpatterns = [
    path("", CourseListView.as_view(), name="course-list"),
    path("<slug:slug>/", CourseDetailView.as_view(), name="course-detail"),
]