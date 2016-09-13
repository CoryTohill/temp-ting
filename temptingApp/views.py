from .models import Team, TempLog, Temp
from django.contrib.auth.models import User
from rest_framework import viewsets
from .serializers import TeamSerializer, TempLogSerializer, TempSerializer, UserSerializer
import threading
import os,sys
from yocto_api import *
from yocto_temperature import *
import json
from django.http import HttpResponseRedirect, HttpResponse, HttpRequest
from . import models



class Team(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TempLog(viewsets.ModelViewSet):
    queryset = TempLog.objects.all()
    serializer_class = TempLogSerializer

class Temp(viewsets.ModelViewSet):
    queryset = Temp.objects.all()
    serializer_class = TempSerializer


class User(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


def start_logging_temps(request):
    data = json.loads(request.body.decode("utf-8"))

    temp_log_id = data["temp_log_id"]

    temp_log = models.TempLog.objects.filter(id=temp_log_id)[0]


    # def usage():
    #     scriptname = os.path.basename(sys.argv[0])
    #     print("Usage:")
    #     print(scriptname+' <serial_number>')
    #     print(scriptname+' <logical_name>')
    #     print(scriptname+' any  ')
    #     sys.exit()

    def die(msg):
        sys.exit(msg+' (check USB cable)')

    errmsg=YRefParam()

    # if len(sys.argv)<2 :  usage()

    target = "THRMCPL1-6F5AC"

    # Setup the API to use local USB devices
    if YAPI.RegisterHub("usb", errmsg)!= YAPI.SUCCESS:
        return HttpResponse(status=400)

    # retreive any temperature sensor
    sensor = YTemperature.FirstTemperature()
    if sensor is None :
        return HttpResponse(status=400)
    else:
        sensor= YTemperature.FindTemperature(target + '.temperature1')

    if not(sensor.isOnline()):return HttpResponse(status=400)

    # retreive module serial
    serial=sensor.get_module().get_serialNumber()


    # retreive both channels
    channel1 = YTemperature.FindTemperature(serial + '.temperature1')
    print(channel1.get_currentValue())

    current_temp = round(channel1.get_currentValue())

    models.Temp.objects.create(value=current_temp, temp_log=temp_log)

    # test = Temp(value=current_temp,temp_log=temp_log)
    print("variable", round(channel1.get_currentValue()))
    # test.save()
    return HttpResponse(status=200)


    # def tempLogger():
    #     while True:
    #         print("channel 1/2:  "+ "%2.1f / " % channel1.get_currentValue() + \
    #                                 # "%2.1f" % channel2.get_currentValue() + \
    #                                 " deg F (Ctrl-C to stop)")
    #         YAPI.Sleep(1000)

    # thre = threading.Thread(target=tempLogger)
    # thre.start()





def create_event(request):
    data = json.loads(request.body.decode("utf-8"))

    name = data["name"]
    description = data["description"]
    start_time = data["start_time"]
    end_time = data["end_time"]
    max_tickets = data["max_tickets"]
    venue = Venue.objects.get(pk=data["venue"])

    try:
        event_obj = Event(name=name,
                          description=description,
                          start_time=start_time,
                          end_time=end_time,
                          max_tickets=max_tickets,
                          venue=venue)
        event_obj.save()

        return HttpResponse(status=200)

    except IntegrityError:
        return HttpResponse(status=400)
