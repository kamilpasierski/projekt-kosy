from django.urls import path
from . import views

urlpatterns = [
    path('', views.PopularClubsView.as_view(), name='popular-clubs'),
    path('<int:id>/', views.ClubDetailView.as_view(), name='club-detail'),
]
