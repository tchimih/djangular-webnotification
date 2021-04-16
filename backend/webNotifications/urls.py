"""webpushdjango URL Configuration
...
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static
from .views import send, send_push, send_notif
# from API.views import HelloView
# from rest_framework.authtoken.views import obtain_auth_token
from django.views.generic import TemplateView

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('', send),
                  path('api/notify/', send_notif),
                  path('', include("django.contrib.auth.urls")),
                  path('send_push', send_push),
                  path('webpush/', include('webpush.urls')),
                  url(r'^api/', include('api.urls')),
                  url(r'^ws/', include(('ws.urls','ws'), namespace='ws')),
                  path('sw.js', TemplateView.as_view(template_name='sw.js', content_type='application/x-javascript'))
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
