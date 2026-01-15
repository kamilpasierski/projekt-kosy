from django.urls import path
from . import views

urlpatterns = [
    path('update/', views.relation_update_view, name='relation-update'),
]