from django.urls import path
from . import views

urlpatterns = [
    path('', views.AllClubsView.as_view(), name='all-clubs'),
]
