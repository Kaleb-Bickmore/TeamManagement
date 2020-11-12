"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.urls import path, include                 # add this
from rest_framework import routers                    # add this
from user import views as user_views                         # add this
                         # add this

router = routers.DefaultRouter()                      # add this
router.register(r'users', user_views.UserView, 'users') # add this
#router.register(r'post_images', user_views.imageView, 'post_images')
urlpatterns = [
    path('admin/', admin.site.urls), 
    path('api/', include(router.urls))                # add this
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
