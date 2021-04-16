from django.conf.urls import url
from api import views
from rest_framework.authtoken.views import ObtainAuthToken
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    url(r'^choices/', views.getChoices),
    url(r'^login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    url(r'^notification/$', views.notificationAPI),
    url(r'^notification/count$', views.getNotificationCount),
    url(r'^qualify/$', views.qualifyCall),
    # url(r'^employee/$', views.employeeAPI),
    # url(r'^employee/([0-9]+)$', views.employeeAPI),
]