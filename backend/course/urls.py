from .controllers.views import CourseListView
from django.urls import path

urlpatterns = [
    path("", CourseListView.as_view(), name="course-list")
]