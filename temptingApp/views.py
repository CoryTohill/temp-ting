from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from rest_framework import viewsets, permissions
from .models import Team, TempLog, Temp
from .serializers import TeamSerializer, TempLogSerializer, TempSerializer, UserSerializer
from yocto_api import *
from yocto_temperature import *
from . import models
import threading, json


# global threading event
e = threading.Event()
e.clear()


class Team(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class TempLog(viewsets.ModelViewSet):
    queryset = TempLog.objects.all()
    serializer_class = TempLogSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class Temp(viewsets.ModelViewSet):
    queryset = Temp.objects.all()
    serializer_class = TempSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class User(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


def start_logging_temps(request):
    data = json.loads(request.body.decode("utf-8"))

    thermometer = data["thermometer"]
    temp_log_id = data["temp_log_id"]

    temp_log = models.TempLog.objects.filter(id=temp_log_id)[0]

    # Yocto api error message
    errmsg = YRefParam()

    # Setup the API to use local USB devices
    if YAPI.RegisterHub("usb", errmsg)!= YAPI.SUCCESS:
        return HttpResponse(status=400)

    # retreive any temperature sensor and check that it is online
    sensor = YTemperature.FirstTemperature()

    if sensor is None :
        return HttpResponse(status=400)
    else:
        sensor = YTemperature.FindTemperature(thermometer + '.temperature1')
    if not(sensor.isOnline()):
        return HttpResponse(status=400)

    # retreive sensor serial
    serial = sensor.get_module().get_serialNumber()

    # retreive thermometer channel
    channel1 = YTemperature.FindTemperature(serial + '.temperature1')
    print(channel1.get_currentValue())

    # if the current thermometer is already logging data, send a 400 status
    if thermometer in [thread.name for thread in threading.enumerate()]:
        return HttpResponse(status=400)

    # target method to start a logging thread
    def start_log(e):
        e.clear()
        while not e.isSet():
            current_temp = round(channel1.get_currentValue())
            models.Temp.objects.create(value=current_temp, temp_log=temp_log)
            print(current_temp)
            e.wait(2)

    thread = threading.Thread(name=thermometer, target=start_log, args=(e,))
    thread.start()

    return HttpResponse(status=200)


def stop_logging_temps(request):
    e.set()
    return HttpResponse(status=200)


def user_login(request):
    data = json.loads(request.body.decode("utf-8"))
    username = data['username']
    password = data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse(user, content_type="application/json", status=200)

    else:
        return HttpResponse(status=400)


def user_logout(request):
    logout(request)
    return HttpResponse(status=200)
