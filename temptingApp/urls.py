from rest_framework import routers
from django.conf.urls import url, include
from temptingApp import views


router = routers.DefaultRouter()
router.register(r'teams', views.Team)
router.register(r'templogs', views.TempLog)
router.register(r'temps', views.Temp)
router.register(r'users', views.User)


urlpatterns = [
    url(r'^', include(router.urls)),
]
