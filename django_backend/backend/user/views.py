from django.shortcuts import render
from rest_framework import viewsets          # add this
from .serializers import UserSerializer      # add this
from .models import User                     # add this

class UserView(viewsets.ModelViewSet):       # add this
  serializer_class = UserSerializer          # add this
  queryset = User.objects.all() # add this