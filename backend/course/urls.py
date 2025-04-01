from course.controllers.views import (
    CompleteLessonAPIView,
    CompleteQuizAPIView,
    CourseCategoryListView,
    CourseCreateUpdateAPIView,
    CourseDetailView,
    CourseEnrollmentModuleLessonView,
    CourseListView,
    EnrolledCourseQuizView,
    EnrollmentCourseLessonView,
    MCQQuestionAPIView,
    QuizCreateAPIView,
    QuizDeleteAPIView,
    QuizListAPIView,
    QuizUpdateAPIView,
)
from django.urls import path

urlpatterns = [
    # for courses
    path("", CourseListView.as_view(), name="course-list"),
    path("category/", CourseCategoryListView.as_view(), name="course-category"),
    path("create/", CourseCreateUpdateAPIView.as_view(), name="course-create"),
    path(
        "update/<int:course_id>/",
        CourseCreateUpdateAPIView.as_view(),
        name="update-course",
    ),
    path(
        "delete/<int:course_id>/",
        CourseCreateUpdateAPIView.as_view(),
        name="delete-course",
    ),
    path("<slug:slug>/", CourseDetailView.as_view(), name="course-detail"),
    # for enrollments
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
    path(
        "enrollments/<uuid:enrollment_id>/modules/",
        EnrollmentCourseLessonView.as_view(),
        name="enrolled-course-modules",
    ),
    # for question
    path(
        "quizzes/<int:quiz_id>/questions/",
        MCQQuestionAPIView.as_view(),
        name="mcq-question-list-create",
    ),
    path(
        "questions/<int:question_id>/",
        MCQQuestionAPIView.as_view(),
        name="mcq-question-update-delete",
    ),
    # for quizze
    path("quizzes/create/", QuizCreateAPIView.as_view(), name="quiz-create"),
    path("quizzes/", QuizListAPIView.as_view(), name="quiz-list"),
    path(
        "enrollments/<uuid:enrollment_id>/modules/<str:module_id>/quizzes/",
        EnrolledCourseQuizView.as_view(),
        name="enrolled-course-module-quizzes",
    ),
    path(
        "quizzes/<int:quiz_id>/update/", QuizUpdateAPIView.as_view(), name="quiz-update"
    ),
    path(
        "quizzes/<int:quiz_id>/delete/", QuizDeleteAPIView.as_view(), name="quiz-delete"
    ),
]
