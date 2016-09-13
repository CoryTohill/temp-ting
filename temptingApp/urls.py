from rest_framework import routers
from django.conf.urls import url, include
from temptingApp import views
from django.views.decorators.csrf import csrf_exempt


router = routers.DefaultRouter()
router.register(r'teams', views.Team)
router.register(r'templogs', views.TempLog)
router.register(r'temps', views.Temp)
router.register(r'users', views.User)


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^start_logging_temps', csrf_exempt(views.start_logging_temps)),
    url(r'^stop_logging_temps', csrf_exempt(views.stop_logging_temps)),
    url(r'^login', csrf_exempt(views.user_login)),
    url(r'^logout', csrf_exempt(views.user_logout)),
]
