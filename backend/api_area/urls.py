# urls.py
from django.urls import path
from .views import AreaListView

urlpatterns = [
    path('area/', AreaListView.as_view(), name='area-list'),
]