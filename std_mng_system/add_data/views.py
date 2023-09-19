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


#load page add_data
@login_required(login_url='login_std')
def add_data_view(request):
    return render(request, 'add_file.html')

@login_required(login_url='login_std')
def add_file(request):
    if request.method == 'POST':
        excel_file = request.FILES.get('excel_file')
        if excel_file:
            df = pd.read_excel(excel_file)
            print(df)
            for row in df.itertuples():
                idStd = row[1]
                password = str(row[2])
                name = row[3]
                datebirth = row[4]
                gender = row[5]
                address = row[6]
                identity = row[7]
                ethnic = row[8]
                phone = row[9]
                email = row[10]
                idClass = row[11]
                classobj = FacultyClasses.objects.get(idClass = idClass)
                try:
                    std = profile_std.objects.get(idStd = idStd)
                except profile_std.DoesNotExist:
                    new_profile = profile_std(
                        idStd = idStd,
                        password = password,
                        phoneStd = phone,
                        nameStd = name,
                        emailStd = email,
                        datebirthStd = datebirth,
                        genderStd = gender,
                        identityStd = identity,
                        ethnicityStd = ethnic,
                        addressStd = address,
                        idClass = classobj,
                    )
                    new_profile.save()
                    print("save successful")
    return JsonResponse({'oke': 'oke'})


