from django.contrib.auth.models import User

from rest_framework import serializers

from temptingApp.models import Team, TempLog, Temp




class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'password', 'teams')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
        )

        user.set_password(validated_data['password'])
        user.save()
        return user


class TeamSerializer(serializers.HyperlinkedModelSerializer):
    # users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ('id', 'url', 'name', 'description', 'users')


class TempLogSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = TempLog
        fields = ('id', 'url', 'description', 'start_date', 'total_cook_time', 'team')


class TempSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Temp
        fields = ('id', 'url', 'value', 'created', 'temp_log')
