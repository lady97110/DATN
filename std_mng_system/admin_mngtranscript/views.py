from django.shortcuts import render
import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render , redirect
from django.contrib.auth.decorators import login_required
from login_std.models import profile_std
from course.models import *
from schedule.models import *
from datetime import datetime
from django.db.models import Q
from login_admin.models import profile_admin
import pandas as pd



# Create your views here.
@login_required(login_url='login_admin')
def admin_mngtranscript(request):

    getidAdmin = request.user.idAdmin                                           # thong tin admin
    admininfo = profile_admin.objects.get(idAdmin=getidAdmin)
    infoAdmin = {'admininfo': admininfo,}

    return render(request, 'admin_mngtranscript.html', infoAdmin)



#tim lop hoc phan
@login_required(login_url='login_admin')
def get_search_class(request, value):
    try:
        results = FacultyClasses.objects.filter(idClass__icontains=value)
        classes_data = [{
            'idClass': result.idClass,
            'department': result.department.nameDepartment,
            'faculty': result.department.faculty.nameFaculty,
            'idCourse': result.idCourse.nameCourse,
        } for result in results]
        return JsonResponse({'classes': classes_data})
    except FacultyClasses.DoesNotExist:
        return JsonResponse({'exists': False})
    

#lay list hoc phan thuoc lop
@login_required(login_url='login_admin')
def get_list_module(request, idClass):
    modules_data = []
    moduleclasses = ModuleClass.objects.filter(idClass__idClass=idClass)
    for moduleclass in moduleclasses:
        data = {
            'idModuleClass': moduleclass.idModuleClass,
            'idModule': moduleclass.module.idModule,
            'nameModule': moduleclass.module.nameModule,
        }
        modules_data.append(data)
    return JsonResponse({'modules': modules_data})


#lay danh sach sinh vien thuoc lop hoc phan
@login_required(login_url='login_admin')
def get_list_std(request, idClass, idModule):
    obj_idClass = FacultyClasses.objects.get(idClass=idClass)
    obj_module = Module.objects.get(idModule=idModule)
    obj_moduleclass = ModuleClass.objects.get(idClass=obj_idClass, module = obj_module)

    std_modules = Student_ModuleClass.objects.filter(module_class = obj_moduleclass)

    transcripts = [{
        'idStd' : std_module.idStd.idStd,
        'nameStd' : std_module.idStd.nameStd,
        'date_birth' : std_module.idStd.datebirthStd.strftime('%d/%m/%Y'),
        'process_grade' : std_module.process_grade,
        'final_grade' : std_module.final_grade,
        'overall_grade' : std_module.overall_grade,
        'overall_grade_4': std_module.overall_grade_4,
        'overall_grade_text': std_module.overall_grade_text,
        'is_pass': 'Đạt' if std_module.is_pass else 'Không đạt',
    } for std_module in std_modules]
    return JsonResponse({'transcripts': transcripts})


