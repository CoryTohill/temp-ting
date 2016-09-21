from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import url, include

from rest_framework import routers

from temptingApp import views


router = routers.DefaultRouter()
router.register(r'teams', views.Team)
router.register(r'templogs', views.TempLog)
router.register(r'temps', views.Temp)
router.register(r'users', views.User)


urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^start_logging_temps', csrf_exempt(views.start_logging_temps)),
    url(r'^stop_logging_temps', csrf_exempt(views.stop_logging_temps)),
    url(r'^get_latest_temp', csrf_exempt(views.get_latest_temp)),
    url(r'^login', csrf_exempt(views.user_login)),
    url(r'^calculate_cook_time', csrf_exempt(views.calculate_cook_time)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
