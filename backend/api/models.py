from django.db import models
from django.utils import timezone

# Create your models here.

class Notification(models.Model):
    NotificationId      = models.AutoField(primary_key=True)
    NotificationDestExt = models.CharField(max_length=100)
    NotificationSrcExt  = models.CharField(max_length=100)
    NotificationDate    = models.DateTimeField(default=timezone.now())


class Qualification(models.Model):
    QualificationId      = models.AutoField(primary_key=True)
    QualificationDestExt = models.CharField(max_length=100)
    QualificationSrcExt  = models.CharField(max_length=100)
    QualificationComment = models.CharField(max_length=800)
    QualificationType    = models.CharField(max_length=100, default="")
    QualificationSubType = models.CharField(max_length=100, default="")
    QualificationDate    = models.DateTimeField(default=timezone.now())

# class Employee(models.Model):
#     EmployeeId      = models.AutoField(primary_key=True)
#     EmployeeName    = models.CharField(max_length=100)
#     EmployeeExt     = models.IntegerField()
#     Departement     = models.CharField(max_length=100)
#     DateOfJoining   = models.DateField()
#     PhotoFileName   = models.CharField(max_length=100)