from django.contrib import admin
from .models import *


# Register your models here.
class tuitionfeeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in tuitionfee._meta.get_fields()]
    search_fields = ['idStd',]

admin.site.register(tuitionfee, tuitionfeeAdmin)