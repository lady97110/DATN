from django.urls import path
from . import views

urlpatterns = [
    path('add-data1/', views.add_data_view, name='add_data'),
]