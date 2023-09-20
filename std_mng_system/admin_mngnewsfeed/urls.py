from django.urls import path
from . import views


urlpatterns = [
    path('save-newsfeed/', views.save_newsfeed),
    path('get-newsfeed/<str:search_value>/', views.get_newsfeed),
]