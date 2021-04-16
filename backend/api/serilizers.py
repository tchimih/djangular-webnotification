from rest_framework import serializers
from api.models import Notification, Qualification


class NotificationSerilization(serializers.ModelSerializer):
    class Meta:
        model   = Notification
        fields  = ( 'NotificationId',
                    'NotificationDestExt',
                    'NotificationSrcExt',
                    'NotificationDate')

class QualificationSerilization(serializers.ModelSerializer):
    class Meta:
        model   = Qualification
        fields  = ( 'QualificationId',
                    'QualificationDestExt',
                    'QualificationSrcExt',
                    'QualificationComment',
                    'QualificationType',
                    'QualificationSubType',
                    'QualificationDate')


# class EmployeeSerilization(serializers.ModelSerializer):
#     class Meta:
#         model   = Employee
#         fields  = ( 'EmployeeId',
#                     'EmployeeName',
#                     'EmployeeExt',
#                     'Departement',
#                     'DateOfJoining',
#                     'PhotoFileName')