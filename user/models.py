from django.db import models
from django.utils import timezone


class User(models.Model):
  name = models.CharField(max_length=120)
  address = models.CharField(max_length=120)
  emailaddress = models.EmailField()
  phonenumber = models.CharField(max_length=120)
  position = models.CharField(max_length=120)
  department = models.CharField(max_length=120)
  start = models.CharField(max_length=120)
  end = models.CharField(max_length=120)
  department = models.CharField(max_length=120)
  status = models.CharField(max_length=120)
  shift = models.CharField(max_length=120)
  manager = models.CharField(max_length=120)
  photo = models.ImageField(upload_to='images')
  color = models.CharField(max_length=120)
  permissions = models.CharField(max_length=120)
  history = models.TextField(default="[]")
  
  
  def _str_(self):
    return self.name
