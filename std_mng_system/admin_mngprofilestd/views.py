from django.shortcuts import render , redirect
from login_std.models import profile_std 
from .forms import *
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from .globals import gotidStd
from login_admin.models import *
from faculty.models import *

@login_required(login_url='login_admin')
def admin_mngprofilestd(request):
    getidAdmin = request.user.idAdmin
    admininfo = profile_admin.objects.get(idAdmin=getidAdmin)
    context = {'admininfo': admininfo,}

    search_form = CustomSearchForm(request.GET)
    results = []
    search_field = None
    if request.GET.get('search_query'):
        search_query = request.GET.get('search_query')
        search_field = request.GET.get('search_field')

        if search_field == 'id':
            results = profile_std.objects.filter(idStd__icontains=search_query)
        elif search_field == 'name':
            results = profile_std.objects.filter(nameStd__icontains=search_query)
        elif search_field == 'birthdate':
            results = profile_std.objects.filter(datebirthStd__icontains=search_query)
        elif search_field == 'address':
            results = profile_std.objects.filter(addressStd__icontains=search_query)
        elif search_field == 'class':
            results = profile_std.objects.filter(idFacultyClass__idFacultyClass__icontains=search_query)
        elif search_field == 'gender':
            results = profile_std.objects.filter(genderStd__icontains=search_query)
        elif search_field == 'ethnicity':
            results = profile_std.objects.filter(ethnicityStd__icontains=search_query)
        elif search_field == 'phone':
            results = profile_std.objects.filter(phoneStd__icontains=search_query)
        elif search_field == 'email':
            results = profile_std.objects.filter(emailStd__icontains=search_query)
        elif search_field == 'identity':
            results = profile_std.objects.filter(identityStd__icontains=search_query)
    return render(request, 'admin_mngprofilestd.html', {'search_form': search_form, 'results': results, 'search_field': search_field, **context})

@login_required(login_url='login_admin')
def delete_profile(request):
    try:
        idStd = gotidStd
        profile = profile_std.objects.get(idStd=idStd)
        profile.delete()
        return JsonResponse({'confirm': True})
    except profile_std.DoesNotExist:
        return JsonResponse({'confirm': False})
    
    

    

@login_required(login_url='login_admin')
def get_profile_detail(request, idStd):
    global gotidStd
    gotidStd = idStd
    try:
        profile_detail = profile_std.objects.get(idStd=idStd)
        datedmy = profile_detail.datebirthStd
        details = model_to_dict(profile_detail)
        details.update({
            'department': profile_detail.idClass.department.nameDepartment,
            'idDepartment': profile_detail.idClass.department.idDepartment,   #valuedepartment
            'faculty': profile_detail.idClass.faculty.nameFaculty,
            'idFaculty': profile_detail.idClass.faculty.idFaculty,    #valuefaculty
            'idCourse': profile_detail.idClass.idCourse,
            'datebirthStd': datedmy.strftime('%d/%m/%Y')
        })
        print(details)
        return JsonResponse(details)

    except profile_std.DoesNotExist:
        return JsonResponse({"error": "Không tìm thấy hồ sơ"}, status=404)



# lấy danh sách khoa
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

# lấy danh sách lớp thuộc ngành
@login_required(login_url='login_admin')
def get_class(request, idDepartment):
    classes = FacultyClasses.objects.filter(department = idDepartment)
    classes_data = [{'idClass': classe.idClass} for classe in classes]
    return JsonResponse({'classes': classes_data})