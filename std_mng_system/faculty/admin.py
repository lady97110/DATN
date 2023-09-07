from django.contrib import admin
from .models import *
from django.utils.safestring import mark_safe


#tùy chỉnh giao diện của bảng Khoa trong admin
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('idFaculty','nameFaculty','view_classes')
    search_fields = ('idFaculty', 'nameFaculty',)

    def view_classes(self, obj):
         url = "/admin/faculty/department/?faculty={}".format(obj.idFaculty)
         link = '<a href="{}">Danh sách ngành</a>'.format(url)
         return mark_safe(link)
    view_classes.short_description = 'Danh sách'

admin.site.register(Faculty, FacultyAdmin)


#tùy chỉnh giao diện của bảng Ngành trong admin
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('idDepartment', 'nameDepartment', 'faculty', 'view_classes')
    search_fields = ('idDepartment', 'faculty__nameFaculty', 'faculty__idFaculty', 'nameDepartment')
    autocomplete_fields = ('faculty',)
    def view_classes(self, obj):
        url = "/admin/faculty/facultyclasses/?department={}".format(obj.idDepartment)
        link = '<a href="{}">Danh sách lớp</a>'.format(url)
        return mark_safe(link)
    view_classes.short_description = 'Danh sách'

admin.site.register(Department, DepartmentAdmin)


#tùy chỉnh giao diện của bảng lớp trong Khoa
class FacultyClassesAdmin(admin.ModelAdmin):
     list_display = ('idClass', 'department','idCourse','view_students')
     search_fields = ('idClass', 'department__nameDepartment','idCourse__idCourse','view_students')
     autocomplete_fields = ('department','idCourse')

     def view_students(self, obj):
         url = "/admin/login_std/profile_std/?idClass={}".format(obj.idClass)
         link = '<a href="{}">Xem danh sách</a>'.format(url)
         return mark_safe(link)
     view_students.short_description = 'Danh sách'


admin.site.register(FacultyClasses, FacultyClassesAdmin)


#Niên khóa
class idCourseAdmin(admin.ModelAdmin):
    list_display = ('idCourse', 'nameCourse')
    search_fields = ('idCourse', 'nameCourse')

admin.site.register(idCourse, idCourseAdmin)