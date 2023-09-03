
from django.contrib import messages
from django.contrib.auth import authenticate, login
from .backends import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.test import override_settings
# Create your views here.



#view login danh cho quan tri vien
@override_settings(AUTHENTICATION_BACKENDS=['login_admin.backends.CustomAuthBackendAdmin'])
def login_admin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user_admin = authenticate(request,username=username, password=password)
        
        if user_admin is not None:
            if 'session_key' in request.session:
                request.session.flush()

            login(request, user_admin)
            
            return redirect('admin_page')
        else:
            messages.error(request, 'Sai thông tin tài khoản')
    return render(request, 'login_admin.html')



#view trang chu admin
@login_required(login_url='login_admin')
def admin_page_view(request):
    getidAdmin = request.user.idAdmin

    admininfo = profile_admin.objects.get(idAdmin=getidAdmin)
    
    context = {'admininfo': admininfo,}

    return render(request, 'admin_page.html', context)

#view dang xuat
@login_required(login_url='login_admin')
def logout_admin_view(request):
    logout(request)
    return redirect('login_admin')


