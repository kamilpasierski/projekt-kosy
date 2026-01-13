from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData, name='get-users'),
    path('me/', views.getCurrentUser, name='current-user'),
]
