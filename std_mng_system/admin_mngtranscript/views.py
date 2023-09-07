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
    try:
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
            'is_pass': 'Đạt' if std_module.is_pass else ('Không đạt' if std_module.is_pass is False else ""),
        } for std_module in std_modules]
        return JsonResponse({'transcripts': transcripts})
    except (ModuleClass.DoesNotExist, FacultyClasses.DoesNotExist, Module.DoesNotExist) as e:
        return JsonResponse({'error': "Không tồn tại lớp học phần này"})


#upload file excel
@login_required(login_url='login_admin')
def upload_file_excel(request, idClass, idModule, action):
    response_data = []
    if request.method == 'POST':
        excel_file = request.FILES.get('excel_file')
        if excel_file:
            df = pd.read_excel(excel_file, skiprows=4)
            for row in df.itertuples():
                idStd = row[2]
                process_grade = row[5]
                final_grade = row[6]
                try:
                    moduleclass = ModuleClass.objects.get(idClass__idClass = idClass, module__idModule = idModule)
                    std_module = Student_ModuleClass.objects.get(idStd__idStd = idStd, module_class = moduleclass)
                    std_module.process_grade = process_grade
                    std_module.final_grade = final_grade
                    std_module.calculate_grade()
                    std_moduleclass = {
                        'idStd' : std_module.idStd.idStd,
                        'nameStd' : std_module.idStd.nameStd,
                        'date_birth' : std_module.idStd.datebirthStd.strftime('%d/%m/%Y'),
                        'process_grade' : std_module.process_grade,
                        'final_grade' : std_module.final_grade,
                        'overall_grade' : std_module.overall_grade,
                        'overall_grade_4': std_module.overall_grade_4,
                        'overall_grade_text': std_module.overall_grade_text,
                        'is_pass': 'Đạt' if std_module.is_pass else ('Không đạt' if std_module.is_pass is False else "")                        
                    }
                    if action == 'upload':
                        response_data.append(std_moduleclass)
                    elif action == 'save':
                        std_module.save()
                        response_data.append(std_moduleclass)
                    else:
                        return JsonResponse({'error': "Hành động không hợp lệ"})
                except ModuleClass.DoesNotExist:
                    return JsonResponse({'error': "Hãy chọn lớp học phần cần thao tác"})
                except Student_ModuleClass.DoesNotExist:
                    return JsonResponse({'error': "Không tồn tại sinh viên có mã  số " + idStd + " trong CSDL"})
            return JsonResponse({'transcripts': response_data})
        else:
            return JsonResponse({'error': "File Excel định dạng không đúng"})
        


#lay thong tin sinh vien
@login_required(login_url='login_admin')
def get_profile_std(request, idStd):
    try:
        this_std = profile_std.objects.get(idStd=idStd)
        class_std = this_std.idClass
        department_std = class_std.department
        faculty = department_std.faculty

        this_profile = {
            'idStd': idStd,
            'nameStd': this_std.nameStd,
            'datebirthStd': this_std.datebirthStd.strftime('%d/%m/%Y'),
            'idClass': class_std.idClass,
            'faculty': faculty.nameFaculty,
        }
        return JsonResponse({'profile': this_profile})
    except profile_std.DoesNotExist:
        return JsonResponse({'error': "MSSV không tồn tại"})



#lay danh sach ky cua sinh vien
@login_required(login_url='login_admin')
def get_semester_std(request, idStd):
    try:
        std = profile_std.objects.get(idStd=idStd)
        transcripts = Student_ModuleClass.objects.filter(idStd = std)
        id_moduleclasses = transcripts.values_list('module_class', flat= True).distinct()
        moduleclasses = ModuleClass.objects.filter(idModuleClass__in = id_moduleclasses)
        id_semester = 
 
    except:
        pass