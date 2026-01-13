from django.urls import path
from . import views

urlpatterns = [
    path('', views.TicketCreate.as_view()),
]
