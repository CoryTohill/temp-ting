from .models import Team, TempLog, Temp
from django.contrib.auth.models import User
from rest_framework import viewsets
from .serializers import TeamSerializer, TempLogSerializer, TempSerializer, UserSerializer


class TeamList(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TempLogList(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = TempLog.objects.all()
    serializer_class = TempLogSerializer

class TempList(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Temp.objects.all()
    serializer_class = TempSerializer


class UserList(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
