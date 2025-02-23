from rest_framework.permissions import BasePermission
from magza.models import *
from .models import *


class IsMagzaUsers(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET','HEAD','OPTIONS'):
            return True
        
        magza=Magzalar.objects.filter(owner=request.user).first()

        if not magza:
            return False
        
        if isinstance(obj,Urunler):
            if obj.magza == magza:
                return True
            else:
                return False
            
        return False
        
        # if request.user in magza.owner:
        #     return True

class KargoTakipPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        urun=SepetUrunleri.objects.filter(sepet=Sepet.objects.get(user=request.user,is_complated=False))
        if urun:
            return True