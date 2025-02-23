from django.shortcuts import render,get_object_or_404
from rest_framework import viewsets,status,permissions
from .serializers import *
from .models import *
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import *
from .permissions import *
from rest_framework.exceptions import ValidationError

# Create your views here.

class SepetViewSet(viewsets.ModelViewSet):
    queryset=Sepet.objects.all()
    serializer_class=SepetSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Sepet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
       serializer.save(user=self.request.user)
    
    @action(detail=False,methods=['get'])
    def active(self,request):
        sepet=Sepet.objects.filter(user=request.user,is_complated=False)
        sepet=sepet.first()
        if not sepet:
            sepet=Sepet.objects.create(user=request.user)
        serializer=self.get_serializer(sepet)
       
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    @action(detail=False,methods=['post'])
    def complate(self,request):
        sepet=Sepet.objects.filter(user=request.user,is_complated=False).first()

        if not sepet:
            return Response({'detail':'Aktif sepet yok'},status=400)
        
        sepet.is_complated=True
        sepet.save()
        yeni_sepet=Sepet.objects.create(user=request.user)
        return Response(
            {
                "eski_sepet":self.get_serializer(sepet).data,
                "yeni_sepet":self.get_serializer(yeni_sepet).data
            },
            status=status.HTTP_200_OK
        )
    @action(detail=True,methods=['get','post'])
    def add_urun(self,request,pk=None):
        sepet,created= Sepet.objects.get_or_create(user=request.user,is_complated=False,pk=pk)

        if request.method=='POST':
            serializer=SepetUrunleriSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            urun=serializer.validated_data['urun']
            adet=serializer.validated_data.get('adet',1)
            renk=serializer.validated_data.get('renk',None)
            beden=serializer.validated_data.get('beden',None)
            sepet_urunu,is_new=SepetUrunleri.objects.update_or_create(
                sepet=sepet,
                urun=urun,
                renk=renk,
                beden=beden,
                defaults={'adet':adet}
            )
            return Response({'detail':'ürün eklendi','sepetUrunId':sepet_urunu.id},status=status.HTTP_201_CREATED)
        
        sepet_serializer=self.get_serializer(sepet)
        return Response(sepet_serializer.data,status=status.HTTP_200_OK)
    
    #belirli bir ürünü sepetten silmek için olusturduğumuz custom action
    @action(detail=True,methods=['post'])
    def remove_urun(self,request, pk=None):
        sepet = self.get_object()

        if not sepet:
            return Response({'error':'sepet bulunamadı'},status=status.HTTP_404_NOT_FOUND)

        urun_id = request.data.get('urun_id')

        if not urun_id:
            return Response({'error':'ürün ID si belirtilmedi'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            sepet_urunu = SepetUrunleri.objects.get(sepet=sepet, id = urun_id)
            sepet_urunu.delete()
            return Response({'message':'ürün sepetten silindi'},status=status.HTTP_200_OK)
        except SepetUrunleri.DoesNotExist:
            return Response({'error':'bu ürün sepette yok'},status=status.HTTP_404_NOT_FOUND)
        
    #sepetteki ürünün adetini arttırmak yada azaltmak için oluşturduğumuz custom action
    @action(detail=True,methods=(['post']))
    def update_urun(self,request, pk=None):
        sepet=self.get_object()
        urun_id = request.data.get('urun_id')
        adet = request.data.get('adet')
        print("urunId", urun_id, "adet", adet)
        # renk = request.data.get("renk")
        # beden = request.data.get("beden")

        if not urun_id or not adet:
            return Response({'error':'ürün id si ve adet belirtilmeli'},status=status.HTTP_400_BAD_REQUEST)

        if adet < 1:
            return Response({'error':'adet en az 1 olmalı'},status=status.HTTP_400_BAD_REQUEST)

        try:
            sepet_urunu = SepetUrunleri.objects.get(sepet = sepet, id=urun_id)
            sepet_urunu.adet = adet
            sepet_urunu.save()
            return Response({'message':'ürünü adeti güncellendi'},status=status.HTTP_200_OK)
        except SepetUrunleri.DoesNotExist:
            return Response({'error':'bu ürün sepette yok'},status=status.HTTP_404_NOT_FOUND)
        
    #Bütün ürünleri sepetten kaldırmak için oluşturduğumuz custom action
    @action(detail=True,methods=(['post']))
    def sepet_clear(self,request, pk=None):
        sepet = self.get_object()
        sepet.sepetUrunleri.all().delete()
        return Response({'message':'sepet Temizlendi'}, status=status.HTTP_200_OK)

    #tamamlanmış sepetleri getiren action
    @action(detail=False, methods=['get'])
    def tamamlanmis_sepetler(self,request):
        tamamlanmis_sepetler = Sepet.objects.filter(user=request.user, is_complated=True)
        serializer = self.get_serializer(tamamlanmis_sepetler, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class RenkViewSet(viewsets.ModelViewSet):
    queryset=Renk.objects.all()
    serializer_class=RenkSerializer
    # permission_classes=[permissions.IsAuthenticated]
    permission_classes=[IsSystemUser]

class BedenViewSet(viewsets.ModelViewSet):
    queryset=Beden.objects.all()
    serializer_class=BedenSerializer
    permission_classes=[IsSystemUser]

class UCommentViewSet(viewsets.ModelViewSet):
    queryset=Comment.objects.all()
    serializer_class=CommentSerializer
    permission_classes=[CommentPermissions]

    @action(detail=False, methods=['get'])
    def urun_yorumlari(self, request):
        urun_id = request.query_params.get('urun_id')
        if not urun_id:
            return Response({'error':'ürün ıd gerekli'}, status=status.HTTP_400_BAD_REQUEST)

        yorumlar = Comment.objects.filter(urun_id=urun_id)
        serializer = self.get_serializer(yorumlar, many=True)
        return Response(serializer.data)
    
    @action(detail=False,methods=['get'])
    def kullanici_urunleri(self,request):

        urun_id = request.query_params.get('urun_id')

        tamamlanmis_sepetler = Sepet.objects.filter(user=request.user, is_complated = True)
        satin_alinan_urunler = SepetUrunleri.objects.filter(sepet__in=tamamlanmis_sepetler).values_list('urun_id',flat=True)

        print("satin",satin_alinan_urunler)
        print("id",urun_id)

        if int(urun_id) in satin_alinan_urunler:
            print("içerde")
            return Response({"aldi":True}, status=status.HTTP_200_OK)
        else:
            return Response({"aldi":False}, status=status.HTTP_200_OK)
        

class UPuanViewSet(viewsets.ModelViewSet):
    queryset=UPuan.objects.all()
    serializer_class=UPuanSerializer
    permission_classes=[CommentPermissions]

    @action(detail=False, methods=['get'])
    def urun_puanlari(self,request):

        urun_id = request.query_params.get('urun_id')

        if not urun_id:
            return Response({'error':'ürün idsi gerekli'},status=status.HTTP_400_BAD_REQUEST)

        puanlar = UPuan.objects.filter(urun_id=urun_id)
        serializer = self.get_serializer(puanlar, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def urun_ortalama_puan(self,request):
        urun_id = request.query_params.get('urun_id')

        if not urun_id:
            return Response({'error':'ürün idsi gerekli'}, status=status.HTTP_400_BAD_REQUEST)

        puanlar = UPuan.objects.filter(urun_id=urun_id)
        if not puanlar.exists():
            return Response({'ortalama_puan': 0})
        
        ortalama_puan = sum(puan.uPuan for puan in puanlar) / puanlar.count()
        return Response({'ortalama_puan':ortalama_puan})

    

class UrunlerViewSet(viewsets.ModelViewSet):
    queryset=Urunler.objects.all()
    serializer_class=UrunlerSerializer
    permission_classes=[IsMagzaUsers]

    @action(detail=False, methods=['get'], url_path='kategori/(?P<slug>[^/.]+)')
    def kategori_urunleri(self,request, slug=None):
        try:
            kategori = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            return Response({'error':'kategori bulunamadı'}, status=status.HTTP_404_NOT_FOUND)

        urunler = Urunler.objects.filter(category=kategori)
        serializer = self.get_serializer(urunler,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        magza_id = self.request.data.get("magza")
        if not magza_id:
            raise ValidationError({'detail':'magazabilgisi eksik'})
        user_magzalar = Magzalar.objects.filter(owner=self.request.user)

        magza = user_magzalar.filter(id=magza_id).first()
        if not magza:
            raise ValidationError({'detail':'geçersiz magaza id si'})

        serializer.save(magza=magza)

    def destroy(self,request,*args,**kwargs):
        urun = self.get_object()
        
        if urun.magza.owner != request.user:
            return Response({'detail':'bu urunu sılme yetkın yok'})

        self.perform_destroy(urun)
        return Response({'detail':'urun silindi'})


    # tüm magazalara ait ürünleri
    @action(detail=False,methods=['get'])
    def benim_urunlerim(self,request):
        user_magzalar = Magzalar.objects.filter(owner=request.user)
        urunler = Urunler.objects.filter(magza__in=user_magzalar)
        serializer = self.get_serializer(urunler,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # tek magazaya ait urunler
    @action(detail=False, methods=['get'])
    def magza_urunleri(self,request):
        magza_id = request.query_params.get("magza_id")
        user_magzalar = Magzalar.objects.filter(id = magza_id)

        if not user_magzalar:
            return Response({'error':'magaza bulunamadı'},status=status.HTTP_404_NOT_FOUND)

        urunler = Urunler.objects.filter(magza=magza_id)
        serializer = self.get_serializer(urunler,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    serializer_class=CategorySerializer
    permission_classes=[IsSystemUser]

class KargoTakipViewSet(viewsets.ModelViewSet):
    queryset=KargoTakip.objects.all()
    serializer_class=KargoTakipSerializer
    permission_classes=[permissions.IsAuthenticated]