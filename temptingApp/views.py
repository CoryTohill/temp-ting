from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, list_route
from rest_framework.response import Response

from yocto_api import *
from yocto_temperature import *

import threading, json, numpy, datetime

from .models import Team, TempLog, Temp
from .serializers import TeamSerializer, TempLogSerializer, TempSerializer, UserSerializer
from . import models


# global threading event
e = threading.Event()
e.clear()

# time interval for logging temperatures
log_interval = 5


class Team(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class TempLog(viewsets.ModelViewSet):
    queryset = TempLog.objects.all()
    # model = models.TempLog
    serializer_class = TempLogSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        user = self.request.user

        if user.is_anonymous():
            return models.TempLog.objects.all()
        else:
            teams = models.Team.objects.filter(users=user)
            logs = models.TempLog.objects.filter(team__in=teams)
            return logs


class Temp(viewsets.ModelViewSet):
    queryset = Temp.objects.all()
    serializer_class = TempSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class User(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        """ If user authentication is sent, return only that user's info,
        otherwise, return the full list of users.
        """
        user = self.request.user

        if user.is_anonymous():
            return models.User.objects.all()
        else:
            return models.User.objects.filter(username=user)




@api_view(['GET', 'POST'])
def start_logging_temps(request):
    data = json.loads(request.body.decode("utf-8"))
    thermometer = data["thermometer"]
    description = data["description"]
    team_id = data["team_id"]

    # Yocto api error message
    errmsg = YRefParam()

    # Setup the API to use local USB devices
    if YAPI.RegisterHub("usb", errmsg)!= YAPI.SUCCESS:
        return Response(status=400)

    # retreive any temperature sensor and check that it is online
    sensor = YTemperature.FirstTemperature()

    if sensor is None :
        return Response(status=400)
    else:
        sensor = YTemperature.FindTemperature(thermometer + '.temperature1')
    if not(sensor.isOnline()):
        return Response(status=400)

    # retreive sensor serial number (in case the thermometer's logical name was passed in)
    serial = sensor.get_module().get_serialNumber()

    # retreive thermometer channel
    channel1 = YTemperature.FindTemperature(serial + '.temperature1')

    # if the current thermometer is already logging data, send a 400 status
    if thermometer in [thread.name for thread in threading.enumerate()]:
        return Response(status=400)

    # create a new TempLog
    team = models.Team.objects.filter(id=team_id)[0]
    temp_log = models.TempLog.objects.create(description=description, team=team)

    # target method to start a logging thread
    def start_log(e):
        e.clear()
        while not e.isSet():
            current_temp = round(channel1.get_currentValue())
            models.Temp.objects.create(value=current_temp, temp_log=temp_log)
            print(current_temp)
            e.wait(log_interval)

    thread = threading.Thread(name=thermometer, target=start_log, args=(e,))
    thread.start()

    return Response(status=200)


@api_view(['POST'])
def stop_logging_temps(request):
    data = json.loads(request.body.decode("utf-8"))
    temp_log_id = data['temp_log_id']

    current_temp_log = models.TempLog.objects.filter(id=temp_log_id)[0]

    end_date = timezone.now()

    updated_temp_log = models.TempLog.objects.filter(id=temp_log_id).update(end_date=end_date)

    # stop threading event by setting it
    e.set()

    return Response(updated_temp_log, content_type="application/json", status=200)

@csrf_exempt
@api_view(['POST'])
def user_login(request):
    data = json.loads(request.body.decode("utf-8"))
    username = data['username']
    password = data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)

        return Response(user.id)

    else:
        return Response(status=400)


@api_view(['POST'])
def calculate_cook_time(request):
    data = json.loads(request.body.decode("utf-8"))

    temp_log = data['temp_log_id']
    target_temp = int(data['target_temp'])

    temp_query_set = models.Temp.objects.filter(temp_log=temp_log).order_by('created')
    temperatures = [temp.value for temp in temp_query_set]
    time_intervals = [t for t in range(len(temperatures))]

    # gets the values of a polynomial equation that fits the temperature data points
    poly_equation = numpy.polyfit(temperatures, time_intervals, 1)

    # plugs in the target_temp to the polynomial equation to determine cook time
    estimated_cook_time = numpy.polyval(poly_equation, target_temp) * log_interval

    return Response(estimated_cook_time, content_type="application/json", status=200)
