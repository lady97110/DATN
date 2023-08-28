from django.shortcuts import render
from login_admin.models import profile_admin
from django.contrib.auth.decorators import login_required
from faculty.models import *
from django.http import JsonResponse
from django.db.models import Q
from course.models import *
from django.forms.models import model_to_dict
from schedule.models import *
import json
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

#lay thong tin mon hoc tu idModule
@login_required(login_url='login_admin')
def get_module_byidModule(request, idModule):
    module = Module.objects.get(idModule=idModule)
    module_data = model_to_dict(module)
    return JsonResponse(module_data)

#lay danh sach phong hoc tu database
@login_required(login_url='login_admin')
def get_room(request):
    rooms = ClassRoom.objects.all()
    rooms_data = [{'idRoom': room.idClassRoom, 'nameRoom': room.nameClassRoom} for room in rooms]
    return JsonResponse({'rooms': rooms_data})


# lay danh sach hoc ky tu database
@login_required(login_url='login_admin')
def get_semester(request):
    semesters = Semester.objects.all()
    semester_data = [{'idSemester': semester.idSemester, 'nameSemester': semester.nameSemester} for semester in semesters]
    return JsonResponse({'semesters': semester_data})


# luu thong tin ve lop mon hoc da tao
@login_required(login_url='login_admin')
def save_moduleclass(request, idClass, idModule, idSemester):
    response_data = {}
    if request.method == 'POST':
        data_schedule = json.loads(request.body)
        tableSchedules = data_schedule.get('tableSchedule')
        tableScheduleExam = data_schedule.get('tableScheduleExam')
        max_slot = data_schedule.get('max_slot')

        module_instance = Module.objects.get(idModule = idModule)
        idClass_instance = FacultyClasses.objects.get(idClass = idClass)
        semester_instance = Semester.objects.get(idSemester = idSemester)

        try:
            thisModuleClass = ModuleClass.objects.get(module = module_instance, idClass = idClass_instance)
            thisModuleClass.max_slot = max_slot
            thisScheduleModuleClass = ScheduleModuleClass.objects.filter(idModuleClass = thisModuleClass)
            for schedule , thisSchedule in zip(tableSchedules, thisScheduleModuleClass):
                thisSchedule.days_of_week = schedule[0]
                thisSchedule.period_start = schedule[1]
                thisSchedule.periods_count = schedule[2]
                thisSchedule.start_date = schedule[3]
                thisSchedule.end_date = schedule[4]
                class_room_instance = ClassRoom.objects.get(idClassRoom=schedule[5])
                thisSchedule.class_room = class_room_instance
                thisSchedule.save()
            
            save_ScheduleExam(tableScheduleExam, thisModuleClass)
            response_data['schedule'] = 'updated_schedule'
            
        except ModuleClass.DoesNotExist:
            newModuleClass = ModuleClass(
                module = module_instance,
                idClass = idClass_instance,
                semester = semester_instance,
                max_slot = max_slot,
            )
            newModuleClass.save()
            print(newModuleClass)
            for schedule in  tableSchedules:
                class_room_instance = ClassRoom.objects.get(idClassRoom = schedule[5])
                newSchedule = ScheduleModuleClass(
                    idModuleClass = newModuleClass,
                    days_of_week = schedule[0],
                    period_start = schedule[1],
                    periods_count = schedule[2],
                    start_date = schedule[3],
                    end_date = schedule[4],
                    class_room = class_room_instance
                )
                newSchedule.save()
                newScheduleExam = ScheduleFinalExam(
                idModuleClass = newModuleClass,
                date_exam = tableScheduleExam[0],
                period_start = tableScheduleExam[1],
                class_room = class_room_instance
            )
            newScheduleExam.save()
            response_data['schedule'] = 'added_new_ModuleClass'
            return JsonResponse(response_data)




def save_ScheduleExam(ScheduleExam_data, idModuleClass_data):
    class_room_exam_instance = ClassRoom.objects.get(idClassRoom = ScheduleExam_data[2])
    try:
        thisScheduleExam = ScheduleFinalExam.objects.get(idModuleClass = idModuleClass_data)
        thisScheduleExam.date_exam = ScheduleExam_data[0]
        thisScheduleExam.period_start = ScheduleExam_data[1]
        thisScheduleExam.class_room = class_room_exam_instance
        thisScheduleExam.save()
        print('updated')
    
    except ScheduleFinalExam.DoesNotExist:
        newScheduleExam = ScheduleFinalExam(
            idModuleClass = idModuleClass_data,
            date_exam = ScheduleExam_data[0],
            period_start = ScheduleExam_data[1],
            class_room = class_room_exam_instance
        )
        newScheduleExam.save()
        print('added')
     


