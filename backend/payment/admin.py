from django.contrib import admin

from .models import Enrollment, Payment

# Register your models here.
admin.site.register(Enrollment)
admin.site.register(Payment)