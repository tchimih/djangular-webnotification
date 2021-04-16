from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser 
from django.http.response import JsonResponse
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


from api.models import Notification, Qualification
from api.serilizers import NotificationSerilization, QualificationSerilization

import json

# Create your views here.

@csrf_exempt
def notificationAPI(request, id=0):
    if request.method == 'GET':
        notification             = Notification.objects.all()
        notification_serializer  = NotificationSerilization(notification, many=True)
        return JsonResponse(notification_serializer.data, safe=False)
    
    elif request.method == 'POST':
        notification_data        = JSONParser().parse(request)
        notification_serializer  = NotificationSerilization(data=notification_data)

        if notification_serializer.is_valid():
            notification_serializer.save()
            return JsonResponse("Notification sent successfully !", safe=False)
        return JsonResponse("Failed to notifiy !", safe=False)
    

# @csrf_exempt
# @api_view(['GET', 'POST', 'PUT', 'DELETE'])
# @permission_classes((IsAuthenticated, ))
# def employeeAPI(request, id=0, format=None):
#     if request.method == 'GET':
#         employees             = Employee.objects.all()
#         employees_serializer  = EmployeeSerilization(employees, many=True)
#         return JsonResponse(employees_serializer.data, safe=False)
    
#     elif request.method == 'POST':
#         employees_data        = JSONParser().parse(request)
#         employees_serializer  = EmployeeSerilization(data=employees_data)

#         if employees_serializer.is_valid():
#             employees_serializer.save()
#             return JsonResponse("Employee added succesfully !", safe=False)
#         return JsonResponse("Failed to add !", safe=False)

#     elif request.method == 'PUT':
#         employees_data        = JSONParser().parse(request)
#         employees             = Employee.objects.get(EmployeeId=id)
#         employees_serializer  = EmployeeSerilization(employees, data=employees_data)
#         print(employees_serializer)

#         if employees_serializer.is_valid():
#             employees_serializer.save()
#             return JsonResponse("Employees updated succesfully !", safe=False)
#         return JsonResponse("Failed to update !", safe=False)

#     elif request.method == 'DELETE':
#         employees             = Employee.objects.get(EmployeeId=id)
#         employees.delete()
#         return JsonResponse("Deleted !", safe=False)


def getChoices(request):
    # TODO implement
    choices = {
        'choices': [
                "Modification de réservation", 
                "Annulation de réservation ",
                "Demande info aides CAF ",
                "Blocage de fonds CAF ",
                "Questions concernant l'utilisation du site VACAF ",
                "Création de code collectivités ",
                "Facturation collectivités ",
                "Demande aménagement de frais, lors d'une modification, annulation de réservation ",
                "Demande remise supplémentaire ",
                "Questionnement conditions de ventes et CPV ",
                "Demande liée à une annulation de séjour VP / VPT ",
                "Demandes clients spécifiquesErreur type de client (collectivités / individuels)",
                "Question en lien avec le traitement des annulations du fait de VPT"
        ]
    }
    return JsonResponse(choices, safe=False)

@csrf_exempt
@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getNotificationCount(request):
    if request.method == 'GET':
        nb_notification             = Notification.objects.count()
        return JsonResponse(nb_notification, safe=False)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def qualifyCall(request):
    body        = request.body
    data        = json.loads(body)
    
    # 1- We retreive the notification from the notification id received
    notification             = Notification.objects.get(NotificationId=data['notificationId'])
    notification_serializer  = NotificationSerilization(notification, many=False)

    # 2- We insert the qualification
    qualification        = {
        'QualificationDestExt': notification_serializer.data['NotificationDestExt'],
        'QualificationSrcExt':notification_serializer.data['NotificationSrcExt'],
        'QualificationComment': str(data['qualificationComment']),
        'QualificationType': str(data['qualificationType']),
        'QualificationSubType': str(data['qualificationSubType'])
    }

    qualification_serializer  = QualificationSerilization(data=qualification)
    print(qualification)

    if qualification_serializer.is_valid():
        qualification_serializer.save()  
        # 3- We delete the notification associated 
        notification.delete()
        return JsonResponse('Success', safe=False)

    return JsonResponse("Failed to add !", safe=False)

# @csrf_exempt
# def savePhoto(request):
#     file        = request.FILES['uploadedFile']
#     file_name   = default_storage.save(file.name, file)

#     return JsonResponse(file_name, safe=False)