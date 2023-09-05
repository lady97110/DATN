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

