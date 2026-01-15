from django.urls import path
from . import views

urlpatterns = [
    path('', views.SetUserClubView.as_view()),
]
