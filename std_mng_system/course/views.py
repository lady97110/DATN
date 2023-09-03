from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render , redirect
from django.contrib.auth.decorators import login_required
from login_std.models import profile_std
from course.models import *
from schedule.models import *

# Create your views here.
@login_required(login_url='login_std')
def module_registration_view(request):

    getidStd = request.user.idStd
    std_info = profile_std.objects.get(idStd=getidStd)
    stdinfo = {'stdinfo': std_info}

    return render(request, 'module_registration.html', stdinfo)


#lay danh sach mon hoc theo lop
@login_required(login_url='login_std')
def get_moduleclass(request, idStd):
    moduleclass_data = []
    
    info_std = profile_std.objects.get(idStd=idStd)
    idClass = info_std.idClass
    moduleclasses = ModuleClass.objects.filter(idClass=idClass)
    for moduleclass in moduleclasses:
        info =  {
            'idModule': moduleclass.module.idModule,
            'nameModule': moduleclass.module.nameModule,
            'credit': moduleclass.module.credits,
            'idClass': moduleclass.idClass.idClass,
            'slot': '0',
            'max_slot': moduleclass.max_slot,
        }
        moduleclass_data.append(info)

    print(moduleclass_data)
    return JsonResponse({'moduleclass': moduleclass_data})


#lay lich hoc va lich thi lop hoc phan
@login_required(login_url='login_std')
def get_detail_schedule(request, idModuleClass):
    schedules = ScheduleModuleClass.objects.filter(idModuleClass__idModuleClass=idModuleClass)
    schedule_exam = ScheduleFinalExam.objects.get(idModuleClass__idModuleClass=idModuleClass)

    schedule_data = [model_to_dict(schedule) for schedule in schedules]
    schedule_exam_data = model_to_dict(schedule_exam)

    return JsonResponse({'schedule': schedule_data, 'schedule_exam': schedule_exam_data})

