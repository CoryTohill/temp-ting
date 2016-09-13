from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class Team(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    users = models.ManyToManyField(User, related_name='teams')

    def __str__(self):
        return self.name


class TempLog(models.Model):
    description = models.CharField(max_length=200)
    start_date = models.DateTimeField(auto_now_add=True)
    total_cook_time = models.TimeField(blank=True,null=True)
    team = models.ForeignKey(Team, related_name='templogs')

    def __str__(self):
        return self.description


class Temp(models.Model):
    value = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    temp_log = models.ForeignKey(TempLog, related_name='temps')

    def __str__(self):
        return str(self.value)
