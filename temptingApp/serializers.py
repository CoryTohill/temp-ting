from rest_framework import serializers
from temptingApp.models import Team, TempLog, Temp
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'teams_set')


class TeamSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Team
        fields = ('id', 'url', 'name', 'description', 'users')


class TempLogSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = TempLog
        fields = ('id', 'url', 'description', 'start_date', 'total_cook_time', 'team')


class TempSerializer(serializers.HyperlinkedModelSerializer):
    # tracks = TrackSerializer(many=True, read_only=True)
    class Meta:
        model = Temp
        fields = ('id', 'url', 'value', 'created', 'temp_log')
