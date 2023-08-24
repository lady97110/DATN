from django.urls import path
from . import views

urlpatterns = [
    path('get-faculty/', views.get_faculty, name ='get_faculty_moduleclass'),
    path('get-department/<str:idFaculty>/', views.get_department, name ='get_department_moduleclass'),
    path('get-idCourse/', views.get_idCourse, name ='get_idCourse'),
    path('get-class/<str:idDepartment>/<str:idCourse>/', views.get_class, name ='get_class'),
    path('search-class/<str:input_value>/', views.get_search_class, name ='search_class'),
]