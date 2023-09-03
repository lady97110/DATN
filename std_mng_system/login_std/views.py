
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from .backends import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .models import profile_std
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.test import override_settings


#view login danh cho sinh vien
@override_settings(AUTHENTICATION_BACKENDS=['login_std.backends.CustomAuthBackendStd'])
def login_std(request):
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user_std = authenticate(request, username=username, password=password)
        if user_std is not None:
            if 'session_key' in request.session:
                request.session.flush()
            login(request, user_std)
            return redirect('profile')
        else:
            messages.error(request, 'Sai thông tin tài khoản')
    return render(request, 'login_std.html')




# Create your views here.
@login_required(login_url='login_std')
def profile_view(request):
    getidStd = request.user.idStd
   
    stdinfo = profile_std.objects.get(idStd=getidStd)
    datebirth = stdinfo.datebirthStd
    context = {'stdinfo': stdinfo, 'datebirth': datebirth.strftime('%d/%m/%Y')}

    return render(request, 'profile.html', context)


@login_required(login_url='login_std')
def logout_std_view(request):
    logout(request)
    return redirect('login_std')



@login_required(login_url='login_std')
def change_password(request):
    getidStd = request.user.username
    stdinfo = profile_std.objects.get(idStd=getidStd)
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Đổi mật khẩu thành công!')
            return redirect('change_password')
        else:
            messages.error(request, 'Có lỗi, hãy kiểm tra lại!')
    else:
        form = PasswordChangeForm(request.user)
    context = {'form': form,'stdinfo': stdinfo}
    return render(request, 'change_password.html', context)