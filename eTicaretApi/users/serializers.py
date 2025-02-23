from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        exclude=['giris_zamani','olusturma_zamani','guncelleme_zamani']

class AdresSerializer(serializers.ModelSerializer):
    class Meta:
        model=Adress
        fields="__all__"
class FavoriUrunSerializer(serializers.ModelSerializer):
    class Meta:
        model=FavoriUrun
        fields="__all__"

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','email','password']

    def create(self, validated_data):
        user=User(email=validated_data["email"],username=validated_data["username"],password=validated_data['password'])
        user.set_password(validated_data["password"])
        user.save()
        return user