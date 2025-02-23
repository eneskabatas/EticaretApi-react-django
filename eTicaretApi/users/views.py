from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import viewsets,permissions,status
from .permissions import *
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.


class UserViewSets(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    permission_classes=[IsSystemUser]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

class AdresViewSet(viewsets.ModelViewSet):
    queryset=Adress.objects.all()
    serializer_class=AdresSerializer
    permission_classes=[permissions.IsAuthenticated]

class FavoriUrunViewSet(viewsets.ModelViewSet):
    queryset=FavoriUrun.objects.all()
    serializer_class=FavoriUrunSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriUrun.objects.filter(owner=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle_favori(self,request):

        user = request.user
        urun_id = request.data.get("urun_id")

        renk_id= request.data.get("renk_id")
        beden_id= request.data.get("beden_id")

        try:
            urun = Urunler.objects.get(pk=urun_id)
            renk = Renk.objects.get(pk=renk_id) if renk_id else None
            beden = Beden.objects.get(pk=beden_id) if beden_id else None
        except Urunler.DoesNotExist:
            return Response({'error':'urun Bulunamadı'},status=status.HTTP_404_NOT_FOUND)
        except Renk.DoesNotExist:
            return Response({'error':'renk bulunamadı'}, status=status.HTTP_404_NOT_FOUND)
        except Beden.DoesNotExist:
            return Response({'error':'beden bulunamadı'},status=status.HTTP_404_NOT_FOUND)

        favori_urun, created = FavoriUrun.objects.get_or_create(
            owner=user, urun=urun, beden=beden, renk=renk
        )

        if not created:
            favori_urun.delete()
            return Response({'mesaj':'ürün favoriden kaldırıldı','eklendi':False},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'mesaj':'ürün favorilere eklendi','eklendi':True},status=status.HTTP_201_CREATED)
    

class RegisterViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=RegisterSerializer
    permission_classes=[RegisterPermissons]




