from django.urls import path
from . import views

urlpatterns = [
    path('pending/', views.PendingTicketsList.as_view(), name='admin-pending-tickets'),
    path('<int:pk>/action/', views.TicketActionView.as_view(), name='admin-ticket-action'),
    path('notifications/', views.UserNotificationsList.as_view(), name='user-notifications'),
    path('change_is_read/', views.NotificationMarkReadView.as_view())
]