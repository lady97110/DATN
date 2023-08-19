from django.contrib import admin
from .models import *
from django.utils.safestring import mark_safe


#tùy chỉnh giao diện của bảng Khoa trong admin
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('idFaculty','nameFaculty','view_classes')
    search_fields = ('idFaculty', 'nameFaculty',)

    def view_classes(self, obj):
         url = "/admin/faculty/facultyclasses/?faculty={}".format(obj.idFaculty)
         link = '<a href="{}">Danh sách lớp</a>'.format(url)
         return mark_safe(link)
    view_classes.short_description = 'Danh sách'

admin.site.register(Faculty, FacultyAdmin)


#tùy chỉnh giao diện của bảng Ngành trong admin
class DepartmentAdmin(admin.ModelAdmin):
     list_display = ('nameDepartment', 'faculty')
     search_fields = ('faculty__nameFaculty', 'faculty__idFaculty', 'nameDepartment')
     autocomplete_fields = ('faculty',)

admin.site.register(Department, DepartmentAdmin)


#tùy chỉnh giao diện của bảng lớp trong Khoa
class FacultyClassesAdmin(admin.ModelAdmin):
     list_display = ('idClass','faculty', 'department','idCourse','view_students')
     search_fields = ('idClass','faculty__nameFaculty', 'department__nameDepartment','idCourse')
     autocomplete_fields = ('faculty', 'department',)
     class Media:
        js = ('falculty/static/js/faculty_classes_admin.js',)

     def view_students(self, obj):
         url = "/admin/profile_std/std_info/?idClass={}".format(obj.idClass)
         link = '<a href="{}">Xem danh sách</a>'.format(url)
         return mark_safe(link)
     view_students.short_description = 'Danh sách'


admin.site.register(FacultyClasses, FacultyClassesAdmin)