"""
URL configuration for std_mng_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from course import views as course_views
from tuitionfee import views as tuitionfee_views
from login_std import views as login_std_views
from login_admin import views as login_admin_views
from admin_mngprofilestd import views as admin_mngprofilestd_views
from admin_moduleclass import views as admin_moduleclass_views



urlpatterns = [
    #superuser
    path('admin/', admin.site.urls),
    #trang sinh vien
    path('', login_std_views.login_std, name='login_std'),
    path('loginadmin', login_admin_views.login_admin, name='login_admin'),
    path('profile/', login_std_views.profile_view, name='profile'),
    path('admin-page/',login_admin_views.admin_page_view, name='admin_page'),
    path('logout-std/', login_std_views.logout_std_view, name='logout_std'),
    path('logout-admin/', login_admin_views.logout_admin_view, name='logout_admin'),
    path('change-password/', login_std_views.change_password, name='change_password'),
    # path('transcript/', course_views.transcript_view, name='transcript'),
    #dang ky hoc phan
    path('module-registration/', course_views.module_registration_view, name= 'module_registration'),
    path('module-registration/', include('course.urls')),
    # path('tuitionfee/', tuitionfee_views.tuitionfee_view, name='tuitionfee'),
    # trang quan tri vien
    path('admin-mngprofilestd', admin_mngprofilestd_views.admin_mngprofilestd , name = 'admin_mngprofilestd'),
    path('delete-profile/', admin_mngprofilestd_views.delete_profile, name='delete_profile'),
    path('detail-profile-std/<str:idStd>/', admin_mngprofilestd_views.get_profile_detail, name = 'detail_profile_std'),
    path('get-faculty/', admin_mngprofilestd_views.get_faculty, name = 'get_faculty'),
    path('get-department/<str:idFaculty>/', admin_mngprofilestd_views.get_department, name = 'get_department'),
    path('get-idCourse/', admin_mngprofilestd_views.get_idCourse, name = 'get_idCourse'),
    path('get-class/<str:idDepartment>/', admin_mngprofilestd_views.get_class, name = 'get_class'),
    path('get-class-add-course/<str:idDepartment>/<str:idCourse>/', admin_mngprofilestd_views.get_class_add_course, name = 'get_class'),
    path('update-or-create-profile/', admin_mngprofilestd_views.update_or_create_profile, name = 'update_or_create_profile'),
    #quản lý lop mon hoc
    path('admin-moduleclass/', admin_moduleclass_views.admin_moduleclass, name = 'admin_moduleclass'),
    path('admin-moduleclass/', include('admin_moduleclass.urls')),
]