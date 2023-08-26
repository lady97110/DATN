from django.contrib import admin
from .models import *


class ClassRoomAdmin(admin.ModelAdmin):
    list_display= ['idClassRoom','nameClassRoom']
    search_fields=['idClassRoom','nameClassRoom']

admin.site.register(ClassRoom, ClassRoomAdmin)

