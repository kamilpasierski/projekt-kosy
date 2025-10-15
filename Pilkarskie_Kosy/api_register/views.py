from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def postData(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def index(request):
    return render(request, 'index1.html')
