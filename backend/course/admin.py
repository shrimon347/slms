from course.models import Course, CourseCategory, Lesson, Module
from django.contrib import admin

# Register your models here.
admin.site.register(CourseCategory)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Lesson)
