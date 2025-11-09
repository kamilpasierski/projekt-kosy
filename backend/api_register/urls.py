from django.urls import path
from . import views

urlpatterns = [
    path('', views.postData, name='register_post')
]