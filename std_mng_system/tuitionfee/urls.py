from django.urls import path
from . import views


urlpatterns = [
    path('get_tuitionfee/', views.get_tuitionfee),
]