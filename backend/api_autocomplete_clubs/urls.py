from django.urls import path
from . import views

urlpatterns = [
    path('', views.ClubAutocomplete.as_view()),
]
