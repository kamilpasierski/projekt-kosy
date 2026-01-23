from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from models.models import ActivityLog
from .serializer import ActivityLogSerializer


class ActivityLogListAPIView(ListAPIView):
    queryset = ActivityLog.objects.select_related("user").all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]
