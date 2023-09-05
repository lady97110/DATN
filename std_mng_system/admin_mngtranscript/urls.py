from django.urls import path
from . import views


urlpatterns = [
    path('get-search-class/<str:value>/', views.get_search_class, name="get_search_class"),
    path('get-list-module/<str:idClass>/', views.get_list_module, name="get_list_module"),
]