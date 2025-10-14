from django.shortcuts import render
from .models import Item


def index(request):
    return render(request, 'index.html')