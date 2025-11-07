from django.urls import path
from . import views

urlpatterns = [
    # Zmień 'post/' na pusty ciąg znaków ''
    path('', views.postData, name='register_post')
]