from course.models import Course, CourseCategory, Lesson, Module, Quiz, StudentProgress
from django.contrib import admin

# Register your models here.
admin.site.register(CourseCategory)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Quiz)
admin.site.register(StudentProgress)
