from course.models import (
    Bannerdata,
    ClassRecording,
    ClassResource,
    Course,
    CourseCategory,
    CourseClass,
    Lesson,
    MCQQuestion,
    Module,
    Option,
    Quiz,
    QuizResult,
    StudentProgress,
)
from django.contrib import admin

# Register your models here.
admin.site.register(Bannerdata)
admin.site.register(CourseCategory)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Quiz)
admin.site.register(StudentProgress)
admin.site.register(MCQQuestion)
admin.site.register(Option)
admin.site.register(QuizResult)
admin.site.register(CourseClass)
admin.site.register(ClassRecording)
admin.site.register(ClassResource)
