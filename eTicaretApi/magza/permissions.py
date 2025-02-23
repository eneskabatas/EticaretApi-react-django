from rest_framework.permissions import BasePermission
from .models import *


class IsMagzaUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        
        if request.method in ('GET','HEAD','OPTIONS'):
            return True
        if request.method in ('POST'):
            if request.user.is_magza:
                return True
            
        return obj.owner==request.user
class IsMagzaOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        print("burası obj permissions: ",request)
        return obj.owner==request.user
    
    # def has_permission(self, request, view):
        
    #     print(request.user)
    #     magza=Magzalar.objects.filter(owner=request.user)
    #     if magza:
    #         return True
        