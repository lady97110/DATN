from django.shortcuts import render
from login_admin.models import profile_admin
from django.contrib.auth.decorators import login_required
from faculty.models import *
from django.http import JsonResponse
from django.db.models import Q
from course.models import *
from django.forms.models import model_to_dict
# Create your views here.
def admin_moduleclass(request):

    getidAdmin = request.user.idAdmin                                           # thong tin admin
    admininfo = profile_admin.objects.get(idAdmin=getidAdmin)
    infoAdmin = {'admininfo': admininfo,}

    return render(request, 'admin_moduleclass.html', infoAdmin)

#lay danh sach khoa
@login_required(login_url='login_admin')
def get_faculty(request):
    faculties = Faculty.objects.all()
    faculties_data = [{'idFaculty': faculty.idFaculty, 'nameFaculty': faculty.nameFaculty} for faculty in faculties]
    return JsonResponse({'faculties': faculties_data})


# lấy danh sách ngành thuộc khoa
@login_required(login_url='login_admin')
def get_department(request, idFaculty):
    departments = Department.objects.filter(faculty = idFaculty)
    departments_data = [{'idDepartment': department.idDepartment, 'nameDepartment': department.nameDepartment} for department in departments]
    return JsonResponse({'departments': departments_data})

#lay danh sach khóa
@login_required(login_url='login_admin')
def get_idCourse(request):
    idCourses = idCourse.objects.all()
    idCourses_data = [{'idCourse': idCourse.idCourse, 'nameCourse': idCourse.nameCourse} for idCourse in idCourses]
    return JsonResponse({'idCourses': idCourses_data})

#lấy danh sách lớp thuộc ngành + khóa
@login_required(login_url='login_admin')
def get_class(request, idDepartment, idCourse):
    classes = FacultyClasses.objects.filter(department = idDepartment, idCourse = idCourse)
    classes_data = [{'idClass': classe.idClass} for classe in classes]
    return JsonResponse({'classes': classes_data})

#tìm lớp
@login_required(login_url='login_admin')
def get_search_class(request ,input_value):
    classes_results = FacultyClasses.objects.filter(
        Q(idClass__icontains = input_value) |
        Q(department__nameDepartment__icontains = input_value) |
        Q(idCourse__nameCourse__icontains = input_value) |
        Q(department__faculty__nameFaculty__icontains = input_value)
    )
    classes_data = [{'idClass': classes.idClass,
                     'department': classes.department.nameDepartment,
                     'faculty': classes.department.faculty.nameFaculty,
                     'idCourse': classes.idCourse.nameCourse } for classes in classes_results]
    return JsonResponse({'classes' :classes_data})



#lấy danh sách môn  học
@login_required(login_url='login_admin')
def get_list_module(request, idClass):
    Department = FacultyClasses.objects.get(idClass = idClass).department
    module_departments = Module.objects.filter(department = Department)
    module_departments_data = [{'idModule': module_department.idModule, 'nameModule': module_department.nameModule, 'credits': module_department.credits, 'department': module_department.department.nameDepartment} for module_department in module_departments]
    return JsonResponse({'module_departments': module_departments_data})


@login_required(login_url='login_admin')
def get_module_byidModule(request, idModule):
    module = Module.objects.get(idModule=idModule)
    module_data = model_to_dict(module)
    return JsonResponse(module_data)