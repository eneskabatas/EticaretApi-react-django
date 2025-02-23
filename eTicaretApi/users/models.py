from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone

from urunmodelleri.models import *
from django.contrib.auth import password_validation


# Create your models here.
class UserManager(BaseUserManager):
    
    def create_kuser(self,username,email,password,**extra_fields):
        if not email and not username:
            raise ValueError("Email ve Kullanıcı adı zorunlu")
        email=self.normalize_email(email)
        user= self.model(username=username,email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_muser(self,username,email,password,**extra_fields):
        extra_fields.setdefault("is_magza",True)

        return self.create_kuser(username,email,password,**extra_fields)
    
    def create_systemuser(self,username,email,password,**extra_fields):
        extra_fields.setdefault('is_systemuser',True)
        return self.create_kuser(username,email,password,**extra_fields)
    def create_superuser(self,username,email,password,**extra_fields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)

        return self.create_kuser(username,email,password,**extra_fields)



class User(AbstractBaseUser,PermissionsMixin):
    username=models.CharField(max_length=255,unique=True)
    # password=models.CharField(max_length=255)
    email=models.EmailField(max_length=255,unique=True)
    telefon=models.CharField(max_length=15,blank=True,null=True)
    first_name=models.CharField(max_length=40,blank=True,null=True)
    last_name=models.CharField(max_length=40,blank=True,null=True)
    tckn=models.PositiveIntegerField(default=11111111111,blank=True,null=True)
    onay=models.BooleanField(default=False)
    bakiye=models.DecimalField(default=0,max_digits=30,decimal_places=2)
    olusturma_zamani=models.DateTimeField(auto_now_add=True)
    giris_zamani=models.DateTimeField(default=timezone.now)
    guncelleme_zamani=models.DateTimeField(auto_now=True)
    profil_resmi=models.FileField(upload_to='profilImage',blank=True,null=True)

    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    is_magza=models.BooleanField(default=False)
    is_systemuser=models.BooleanField(default=False)

    objects=UserManager()
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=['username']

    def __str__(self):
        return self.username
    

class Adress(models.Model):
    owner=models.ForeignKey(User,on_delete=models.CASCADE,related_name="userAdres")
    title=models.CharField(max_length=30)
    adress=models.TextField()


class FavoriUrun(models.Model):
    owner=models.ForeignKey(User,on_delete=models.CASCADE)
    urun=models.ForeignKey(Urunler,on_delete=models.CASCADE)
    renk = models.ForeignKey(Renk, on_delete=models.DO_NOTHING,null=True,blank=True)
    beden = models.ForeignKey(Beden, on_delete=models.DO_NOTHING,null=True,blank=True)

    def __str__(self):
        return self.urun.name