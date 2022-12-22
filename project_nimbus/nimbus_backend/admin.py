from django.contrib import admin
from .models import Trip, RideshareRequest
# from .models import Student
# Register your models here.

"""class StudentAdmin(admin.ModelAdmin):
    pass
admin.site.register(Student, StudentAdmin)"""

# admin.site.register(Student)
admin.site.register(Trip)
admin.site.register(RideshareRequest)

