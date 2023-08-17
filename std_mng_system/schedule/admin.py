from django.contrib import admin
from .models import *


# Register your models here.
class SessionScheduleAdmin(admin.ModelAdmin):
    list_display= list_display = [field.name for field in SessionSchedule._meta.get_fields()]
    search_fields= ['idCourseClass__idClass', 'idCourseClass__idSub__nameSub', 'day_of_week','idRoom','exam_check']
    autocomplete_fields = ['idCourseClass',]
    list_filter = [field.name for field in SessionSchedule._meta.get_fields()]

admin.site.register(SessionSchedule, SessionScheduleAdmin)