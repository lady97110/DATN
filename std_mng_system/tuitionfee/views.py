from django.forms import model_to_dict
from django.shortcuts import render
from login_std.models import profile_std
from django.contrib.auth.decorators import login_required
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from course.models import *
from .models import *
from django.http import JsonResponse
# Create your views here.


#load trang hoc phi
@login_required(login_url='login_std')
def tuitionfee_view(request):

    getidStd = request.user.idStd
    std_info = profile_std.objects.get(idStd=getidStd)
    stdinfo = {'stdinfo': std_info}

    return render(request, 'tuitionfee.html', stdinfo)




#lay du lieu ve hoc phi:
@login_required(login_url='login_std')
def get_tuitionfee(request, idStd):
    std = profile_std.objects.get(idStd=idStd)
    semesters = Semester.objects.filter(semester_tuitionfee__idStd = std)
    semester_tuitionfee = []
    for semseter in semesters:
        moduleclass_tuitionfee = get_moduleclass(std, semseter)
        this_tuititonfee = tuitionfee.objects.get(std, semseter)
        tuitionfee_data = model_to_dict(this_tuititonfee)
        tuitionfee_semester = {
            'semester': semseter.idSemester,
            'moduleclasses': moduleclass_tuitionfee,
            'tuititonfee':tuitionfee_data,
        }
        semester_tuitionfee.append(tuitionfee_semester)
    return JsonResponse({'semester_tuitionfees':semester_tuitionfee})



def get_moduleclass(std, semester):
    try:
        list_moduleclass = ModuleClass.objects.filter(module_std__idStd = std, semester = semester)
        if  not list_moduleclass.exists():
            raise ModuleClass.DoesNotExist
        list_moduleclass_data = []
        for moduleclass in list_moduleclass:
            idModule = moduleclass.module.idModule
            nameModule = moduleclass.module.nameModule
            credit = moduleclass.module.credits
            idClass = moduleclass.idClass
            moduleclass_data = {
                'idModule': idModule,
                'nameModule': nameModule,
                'credit': credit,
                'idClass': idClass
            }
            list_moduleclass_data.append(moduleclass_data)
        data = {
            'moduleclasses': list_moduleclass_data
        }
    except ModuleClass.DoesNotExist:
        data = {
            'moduleclasses': None
        }
    return data
    












#cap nhat lai tuitionfee khi co thay doi trong student_moduleclass
@receiver(post_save, sender = Student_ModuleClass)
@receiver(post_delete, sender = Student_ModuleClass)
def update_tuitionfee(sender,  instance, **kwargs):
    std = instance.idStd
    try:
        list_moduleclass = ModuleClass.objects.filter(module_std__idStd = std)
        if not list_moduleclass.exists():
            raise ModuleClass.DoesNotExist
        id_semesters = list_moduleclass.values_list('semester', flat=True).distinct()
        semesters = Semester.objects.filter(idSemester__in=id_semesters)
        for semester in semesters:
            try:
                tuitionfee_exists = tuitionfee.objects.filter(idStd = std)
                if (not tuitionfee_exists.exists()) or (len(tuitionfee_exists) <= len(semesters)):
                    raise tuitionfee.DoesNotExist
                for tuitionfee_exist in tuitionfee_exists:
                    semester_tuitionfee = tuitionfee_exist.idSemester
                    if semester_tuitionfee.idSemester != semester.idSemester:
                        save_tuitionfee_zero(tuitionfee_exist)
            except tuitionfee.DoesNotExist:
                pass
            credits_semesters = 0
            list_moduleclass_semester = ModuleClass.objects.filter(module_std__idStd = std, semester = semester)
            for module_class_semester in list_moduleclass_semester:
                credits = 0
                module = module_class_semester.module
                credits = module.credits
                credits_semesters += credits
                credits = 0
                save_tuitionfee(std, semester, credits_semesters)
    except ModuleClass.DoesNotExist:
        exist_tuitionfee = tuitionfee.objects.filter(idStd = std)
        if exist_tuitionfee.exists():
            for tuitionfee1 in exist_tuitionfee:
                save_tuitionfee_zero(tuitionfee1)




#ham luu hoc phi
def save_tuitionfee(std, semester, credits_semesters):
    try:
        tuitionfee_semester = tuitionfee.objects.get(idStd = std, idSemester = semester)
        tuitionfee_semester.totalcredit = credits_semesters
        tuitionfee_semester.total_tuitionfee = credits_semesters * 325000
        tuitionfee_semester.unpaid_tuitionfee = credits_semesters * 325000 - int(tuitionfee_semester.paid_tuitionfee)

        tuitionfee_semester.save()
        
    except tuitionfee.DoesNotExist:
        new_tuitionfee = tuitionfee(
            idStd = std,
            idSemester = semester,
            totalcredit =  credits_semesters,
            total_tuitionfee = credits_semesters * 325000,
            paid_tuitionfee = 0,
            unpaid_tuitionfee = credits_semesters * 325000
        )
        new_tuitionfee.save()


def save_tuitionfee_zero(tuitionfee_zero):
    tuitionfee_zero.totalcredit = 0
    tuitionfee_zero.total_tuitionfee = 0
    tuitionfee_zero.unpaid_tuitionfee = 0
    tuitionfee_zero.save()