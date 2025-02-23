from rest_framework import serializers
from .models import *

class MagzaSerialzer(serializers.ModelSerializer):
    
    class Meta:
        model=Magzalar
        
        exclude=['owner','olusturma_zamani','guncelleme_zamani']

    
    def create(self,validated_data):
        user = self.context['request'].user
        return Magzalar.objects.create(owner=user,**validated_data)
        
class BankaSerialzer(serializers.ModelSerializer):
    class Meta:
        model=Bankalar
        exclude=['id']
    

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)

        request=self.context.get('request')
        if request and hasattr(request,'user'):
            self.fields["owner"].queryset=Magzalar.objects.filter(owner=request.user)
    

class MCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=MCommet
        fields=['magza','mYorum']
        
    def create(self,validate_data):
        user=self.context['request'].user
        return MCommet.objects.create(owner=user,**validate_data)

class MPuanSerializer(serializers.ModelSerializer):
    class Meta:
        model=MPuan
        fields=['magza','mPuan']
    
    def create(self,validate_data):
        user=self.context['request'].user
        magza=validate_data['magza']
        puan=validate_data['mPuan']
        puanlama,created = MPuan.objects.update_or_create(owner=user,magza=magza,defaults={'mPuan':puan})
        return puanlama

class SistemBakiyeSerializer(serializers.ModelSerializer):
    class Meta:
        model=SistemBakiye
        fields="__all__"
    