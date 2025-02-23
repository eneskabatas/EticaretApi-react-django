from rest_framework.serializers import ModelSerializer,PrimaryKeyRelatedField
from .models import *
from django.utils.text import slugify

from rest_framework import serializers


class CategorySerializer(ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'

    def create(self,validated_data):
        if not validated_data.get('slug'):
            validated_data['slug']=slugify(validated_data['name'])
        return super().create(validated_data)
    
    def update(self,instance,validated_data):
        if 'slug' in validated_data:
            if not validated_data['slug']:
                validated_data['slug']=slugify(validated_data.get('name',instance.name))
        return super().update(instance,validated_data)
class RenkSerializer(ModelSerializer):
    class Meta:
        model=Renk
        fields='__all__'
class BedenSerializer(ModelSerializer):
    class Meta:
        model=Beden
        fields='__all__'
class UrunlerSerializer(ModelSerializer):
    class Meta:
        model=Urunler
        exclude=['olusturulma_zamani','guncelleme_zamani','slug']
    def create(self,validated_data):
        if not validated_data.get('slug'):
            validated_data['slug']=slugify(validated_data['name'])
        return super().create(validated_data)
    def update(self,instance,validated_data):
        if 'slug' in validated_data:
            if not validated_data['slug']:
                validated_data['slug']=slugify(validated_data.get('name',instance.name))
        
        return super().update(instance,validated_data)

class CommentSerializer(ModelSerializer):
    owner_username = serializers.CharField(source='owner.username',read_only=True)
    urun_name = serializers.CharField(source='urun.name', read_only=True)

    class Meta:
        model=Comment
        fields='__all__'

    def validate(self,data):
        user = self.context['request'].user
        urun = data['urun']
        tamamlanmis_sepetler = Sepet.objects.filter(user=user, is_complated=True)
        satin_alinan_urunler = SepetUrunleri.objects.filter(sepet__in=tamamlanmis_sepetler).values_list('urun_id',flat=True)

        if urun.id not in satin_alinan_urunler:
            raise serializers.ValidationError('ürünü satın almadan yorum yapamazsınız')

        return data

class UPuanSerializer(ModelSerializer):
    owner_username = serializers.CharField(source='owner.username',read_only=True)
    urun_name = serializers.CharField(source='urun.name',read_only=True)


    class Meta:
        model=UPuan
        fields='__all__'
    
    def create(self, validated_data):
        user=self.context['request'].user
        urun=validated_data['urun']
        puan=validated_data['uPuan']

        puanlama,created=UPuan.objects.update_or_create(
            owner=user,
            urun=urun,
            defaults={'uPuan':puan}
        )
        return puanlama
class SepetUrunleriSerializer(ModelSerializer):
    urun=UrunlerSerializer(read_only=True)
    urun_id=PrimaryKeyRelatedField(queryset=Urunler.objects.all(),source='urun',write_only=True)
    renk_id=PrimaryKeyRelatedField(queryset=Renk.objects.all(),source='renk',write_only=True)
    beden_id=PrimaryKeyRelatedField(queryset=Beden.objects.all(),source='beden',write_only=True)
    class Meta:
        model=SepetUrunleri
        fields='__all__'

class SepetSerializer(ModelSerializer):
    sepetUrunleri=SepetUrunleriSerializer(many=True,required=False)
    class Meta:
        model=Sepet
        fields='__all__'
    
    def create(self, validated_data):
        urunler_bilgisi=validated_data.pop('sepetUrunleri',[])
        sepet=Sepet.objects.create(**validated_data)
        for urun_bilgisi in urunler_bilgisi:
            SepetUrunleri.objects.create(sepet=sepet,**urun_bilgisi)
        return sepet
    def update(self, instance, validated_data):
        
        urunler_bilgisi=validated_data.pop('sepetUrunleri',None)
        instance=super().update(instance,validated_data)
        print("1231312312")
        if urunler_bilgisi:
            for urun_bilgisi in urunler_bilgisi:
                urun=urun_bilgisi['urun']
                adet=urun_bilgisi.get('adet',1)

                sepet_urunu,created=SepetUrunleri.objects.get_or_create(
                    sepet=instance,
                    urun=urun,
                    defaults={'adet':adet}
                )
                if not created:
                    sepet_urunu.adet=adet
                    sepet_urunu.save()
        return instance
    
class KargoTakipSerializer(ModelSerializer):
   class Meta:
        model=KargoTakip
        fields="__all__"
    
