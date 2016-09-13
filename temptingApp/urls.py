from rest_framework import routers
from django.conf.urls import url, include
from temptingApp import views


router = routers.DefaultRouter()
router.register(r'teams', views.TeamList)
router.register(r'templogs', views.TempLogList)
router.register(r'temps', views.TempList)
router.register(r'users', views.UserList)


urlpatterns = [
    url(r'^', include(router.urls)),
]
