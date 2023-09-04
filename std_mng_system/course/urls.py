from django.urls import path
from . import views

urlpatterns = [
    path('get-moduleclass/<str:idStd>/', views.get_moduleclass, name = 'get_moduleclass_std'),
    path('get-detail-schedule/<str:idModuleClass>/', views.get_detail_schedule, name = 'get_detail_schedule_std'),
    path('save-moduleclass/<str:idStd>/', views.save_moduleclass, name = 'save_moduleclass_std'),
]