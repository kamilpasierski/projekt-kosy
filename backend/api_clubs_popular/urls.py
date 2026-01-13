from django.urls import path
from . import views

urlpatterns = [
    path('', views.PopularClubsView.as_view(), name='popular-clubs'),
]
