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

# Create your views here.

#global variables

global_semester = None

# kiem tra xem co trong thoi gian dang ky mon hoc
@login_required(login_url='login_std')
def module_registration_view(request):
    current_time = datetime.now()
    current_date = current_time.date()

    getidStd = request.user.idStd
    std_info = profile_std.objects.get(idStd=getidStd)
    stdinfo = {'stdinfo': std_info}

    idClass = std_info.idClass
    idCourse = idClass.idCourse

    try:
        registration_schedule = RegistrationSchedule.objects.filter(idCourse=idCourse)
        for is_registration in registration_schedule:
            start_date = is_registration.start_date
            end_date = is_registration.end_date
            if start_date <= current_date <= end_date:
                semester = is_registration.semester.idSemester
                global global_semester
                global_semester = semester
                return render(request, 'module_registration.html', stdinfo)
        return render(request, 'not_module_registration.html', stdinfo)               
    except RegistrationSchedule.DoesNotExist:
        return render(request, 'not_module_registration.html', stdinfo)     



#tim kiem hoc phan, lop hoc phan
@login_required(login_url='login_std')
def search_moduleclass(request, value):
    global global_semester
    results = ModuleClass.objects.filter(
        Q(module__idModule__iexact=value, semester__idSemester=global_semester) |
        Q(idClass__idClass__iexact=value, semester__idSemester=global_semester)
    )
    moduleclass_data = []
    for moduleclass in results:
        info =  {
            'idModuleClass': moduleclass.idModuleClass,
            'idModule': moduleclass.module.idModule,
            'nameModule': moduleclass.module.nameModule,
            'credit': moduleclass.module.credits,
            'idClass': moduleclass.idClass.idClass,
            'slot': '0',
            'max_slot': moduleclass.max_slot,
        }
        moduleclass_data.append(info)
    return JsonResponse({'moduleclasses': moduleclass_data})
    



#lay danh sach mon hoc theo lop
@login_required(login_url='login_std')
def get_moduleclass(request, idStd):
    moduleclass_data = []
    
    info_std = profile_std.objects.get(idStd=idStd)
    idClass = info_std.idClass

    global global_semester

    moduleclasses = ModuleClass.objects.filter(idClass=idClass, semester__idSemester = global_semester)
    for moduleclass in moduleclasses:
        info =  {
            'idModuleClass': moduleclass.idModuleClass,
            'idModule': moduleclass.module.idModule,
            'nameModule': moduleclass.module.nameModule,
            'credit': moduleclass.module.credits,
            'idClass': moduleclass.idClass.idClass,
            'slot': '0',
            'max_slot': moduleclass.max_slot,
        }
        moduleclass_data.append(info)
    return JsonResponse({'moduleclasses': moduleclass_data})


#lay lich hoc lop hoc phan
@login_required(login_url='login_std')
def get_detail_schedule(request, idModuleClass):
    schedules = ScheduleModuleClass.objects.filter(idModuleClass__idModuleClass=idModuleClass)

    schedule_data = [model_to_dict(schedule) for schedule in schedules]

    return JsonResponse({'schedule': schedule_data})


#luu hoc phan sinh vien da chon
@login_required(login_url='login_std')
def save_moduleclass(request, idStd):
    if request.method == 'POST':
        idStd = profile_std.objects.get(idStd=idStd)
        list_idModuleClass = json.loads(request.body)
        list_exist = []
        exist = False
        for idModuleClass in list_idModuleClass:
            idModule = ModuleClass.objects.get(idModuleClass=idModuleClass).module
            semester = ModuleClass.objects.get(idModuleClass=idModuleClass).semester
            try:
                check = Student_ModuleClass.objects.get(idStd = idStd, module_class__module=idModule, module_class__semester=semester)
                exist = True
                exist_mess = idModule.idModule+" - " + idModule.nameModule
                list_exist.append(exist_mess)
            except Student_ModuleClass.DoesNotExist:
                pass
        
        if not exist:
            for idModuleClass in list_idModuleClass:
                moduleclass = ModuleClass.objects.get(idModuleClass=idModuleClass)
                new = Student_ModuleClass(
                    module_class = moduleclass,
                    idStd = idStd,
                )
                new.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'exist': list_exist})
        


#lay thong tin  hoc phan da  luu
@login_required(login_url='login_std')
def get_saved_moduleclass(request, idStd):
    global global_semester
    moduleclass_data = []
    saved = Student_ModuleClass.objects.filter(idStd__idStd=idStd, module_class__semester__idSemester = global_semester)
    for moduleclass in saved:
        info =  {
            'idModuleClass': moduleclass.module_class.idModuleClass,
            'idModule': moduleclass.module_class.module.idModule,
            'nameModule': moduleclass.module_class.module.nameModule,
            'credit': moduleclass.module_class.module.credits,
            'idClass': moduleclass.module_class.idClass.idClass,
        }
        moduleclass_data.append(info)
    return JsonResponse({'moduleclasses': moduleclass_data})


@login_required(login_url='login_std')
def delete_moduleclass(request, idStd):
    if request.method == 'POST':
        idStd = profile_std.objects.get(idStd=idStd)
        list_idModuleClass = json.loads(request.body)
        
        for moduleclass in list_idModuleClass:
            try:
                check_exist = Student_ModuleClass.objects.get(idStd=idStd, module_class__idModuleClass = moduleclass)
                check_exist.delete()
            except Student_ModuleClass.DoesNotExist:
                pass
    
        return JsonResponse({'success': True})
        