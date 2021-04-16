from django.conf.urls import url
from ws import views

urlpatterns = [
    url(r'^$', views.HomePageView.as_view()),
]