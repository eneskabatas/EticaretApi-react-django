from django.shortcuts import render
from .serializers import *
from rest_framework import generics,viewsets,permissions,status
from .models import *
from .permissions import *
from users.permissions import *
from rest_framework.decorators import action
from rest_framework.response import Response



# Create your views here.


class MagzaViewSet(viewsets.ModelViewSet):
    queryset = Magzalar.objects.all()
    serializer_class= MagzaSerialzer
    permission_classes=[IsMagzaUser,IsMagzaOwner]

    @action(detail=False, methods=['get'])
    def benim_magazalarim(self,request):
        kullanici_magazalar = Magzalar.objects.filter(owner=request.user)
        serializer = self.get_serializer(kullanici_magazalar, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'])
    def guncelle(self,request,pk=None):
        try:
            magza=Magzalar.objects.get(pk=pk, owner=request.user)
        except Magzalar.DoesNotExist:
            return Response({'mesaj':'bu magazayı güncelleme yetkiniz yok'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(magza, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def detay(self,request, pk=None):
        try:
            magza = Magzalar.objects.get(pk=pk)
            serializer = self.get_serializer(magza)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'mesaj':'magaza bulunamadı'},status=status.HTTP_404_NOT_FOUND)
        
    def destroy(self, request, *args, **kwargs):
        magza = self.get_object()
        
        if magza.owner != request.user:
            return Response({'detail':'bu magazayı sılme yetkın yok'})

        self.perform_destroy(magza)
        return Response({'detail':'magaza silindi'})

class BankaViewSet(viewsets.ModelViewSet):
    queryset=Bankalar.objects.all()
    serializer_class=BankaSerialzer
    permission_classes=[permissions.IsAuthenticated,IsMagzaOwner]

class MCommentViewSet(viewsets.ModelViewSet):
    queryset=MCommet.objects.all()
    serializer_class=MCommentSerializer
    permission_classes=[permissions.IsAuthenticated]

class MPuanViewSet(viewsets.ModelViewSet):
    queryset=MPuan.objects.all()
    serializer_class=MPuanSerializer
    permission_classes=[permissions.IsAuthenticated]

class SistemBakiyeViewSet(viewsets.ModelViewSet):
    queryset=SistemBakiye.objects.all()
    serializer_class=SistemBakiyeSerializer
    permission_classes=[IsSystemUser]




    

    
