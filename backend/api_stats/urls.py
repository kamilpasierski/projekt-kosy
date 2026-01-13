from django.urls import path
from .views import GlobalStatsView, MaxBeefsListView

urlpatterns = [
    path('global/', GlobalStatsView.as_view(), name='global-stats'),
    path('max-beefs/', MaxBeefsListView.as_view(), name='max-beefs'),
]