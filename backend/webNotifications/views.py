from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.conf import settings

from rest_framework.parsers import JSONParser 
from webpush import send_user_notification
from api.models import Notification
from api.serilizers import NotificationSerilization


import json

@require_GET
def send(request):
    if not request.user.is_authenticated:
        return redirect('/login')
    webpush_settings = getattr(settings, 'WEBPUSH_SETTINGS', {})
    vapid_key = webpush_settings.get('VAPID_PUBLIC_KEY')
    user = request.user
    return render(request, 'home.html', {user: user, 'vapid_key': vapid_key})


@require_POST
@csrf_exempt
def send_notif(request):
    try:
        body        = request.body
        data        = json.loads(body)
        username    = data['username']
        src         = data['src']
        dst         = data['dst']
        date        = timezone.now()

        uid = User.objects.get(username=username).pk
        user = get_object_or_404(User, pk=uid)

        print(user)

        body = "Corp de notification."
        payload = {
            'notification': {
                'data': {
                    'url' : 'https://google.fr'
                },
                'title' : 'Titre de la notitification',
                'body' : body
	        }
        }

        notification_data = {
            'NotificationDestExt'   : dst,
            'NotificationSrcExt'    : src,
            'NotificationDate'      : date
        }

        send_user_notification(user=user, payload=payload, ttl=1000)

        #notification_data        = JSONParser().parse(notification)
        notification_serializer  = NotificationSerilization(data=notification_data)

        if notification_serializer.is_valid():
            notification_serializer.save()
            return JsonResponse(status=200, data={"message": "Notification sent successfully"})
        else : 
            return JsonResponse(status=500, data={"message": "Notification sent to the user but wasn't stored"})

    except TypeError:
        return JsonResponse(status=500, data={"message": "An error occurred"})

@require_POST
@csrf_exempt
def send_push(request):
    try:
        body = request.body
        data = json.loads(body)

        if 'head' not in data or 'body' not in data or 'id' not in data:
            return JsonResponse(status=400, data={"message": "Invalid data format"})

        user_id = data['id']
        user = get_object_or_404(User, pk=user_id)
        payload = {'head': data['head'], 'body': data['body']}
        send_user_notification(user=user, payload=payload, ttl=1000)

        return JsonResponse(status=200, data={"message": "Web push successful"})
    except TypeError:
        return JsonResponse(status=500, data={"message": "An error occurred"})
