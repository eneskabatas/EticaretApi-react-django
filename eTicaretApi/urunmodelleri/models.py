from django.db import models
from django.utils.text import slugify

from django.conf import settings
from magza.models import *

# Create your models here.

class Category(models.Model):
    name=models.CharField(max_length=100)
    slug=models.SlugField(unique=True)

    # def save(self, *args,**kwargs):
    #     if not self.slug:
    #         self.slug=slugify(self.name)
    #     return super().save(*args,**kwargs)

    def __str__(self):
        return self.name

class Renk(models.Model):
    name=models.CharField(max_length=50)

    def __str__(self):
        return self.name
class Beden(models.Model):
    name=models.CharField(max_length=10)

    def __str__(self):
        return self.name

    
class Urunler(models.Model):
    category=models.ForeignKey(Category,on_delete=models.DO_NOTHING,related_name="urunler")
    name=models.CharField(max_length=200)
    slug=models.SlugField(unique=True)
    aciklama=models.TextField(blank=True,null=True)
    fiyat=models.DecimalField(max_digits=10,decimal_places=2)
    stok=models.PositiveIntegerField(default=0)
    olusturulma_zamani=models.DateTimeField(auto_now_add=True)
    guncelleme_zamani=models.DateTimeField(auto_now=True)
    ebat=models.ManyToManyField(Beden)
    renk=models.ManyToManyField(Renk)
    image=models.ImageField(upload_to='urunler/',null=True,blank=True)
    magza=models.ForeignKey(Magzalar,on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return self.name

class Comment(models.Model):
    owner=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.DO_NOTHING)
    urun=models.ForeignKey(Urunler,on_delete=models.CASCADE,blank=True,null=True)
    uYorum=models.TextField()
    def __str__(self):
        return self.owner.username
class UPuan(models.Model):
    owner=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.DO_NOTHING)
    urun=models.ForeignKey(Urunler,on_delete=models.CASCADE,blank=True,null=True)
    uPuan=models.PositiveIntegerField(default=0)
    def __str__(self):
        return f"{self.owner.username} - {self.urun.name} - {self.uPuan}"



class Sepet(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="sepet")
    olusturulma_zamani=models.DateTimeField(auto_now_add=True)
    guncelleme_zamani=models.DateTimeField(auto_now=True)
    is_complated=models.BooleanField(default=False)

    def __str__(self):
        return f"Sepet: {self.id} - {self.user.username}"
    
class SepetUrunleri(models.Model):
    sepet=models.ForeignKey(Sepet,on_delete=models.CASCADE,related_name="sepetUrunleri")
    urun=models.ForeignKey(Urunler,on_delete=models.CASCADE)
    adet=models.PositiveIntegerField(default=1)
    renk=models.ForeignKey(Renk,on_delete=models.SET_NULL,null=True,blank=True)
    beden=models.ForeignKey(Beden,on_delete=models.SET_NULL,null=True,blank=True)
    ekleme_zamani=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.urun.name} x {self.adet}"
    
class KargoTakip(models.Model):
    urun=models.ForeignKey(Urunler,on_delete=models.DO_NOTHING)
    kargoSirketi=models.CharField(max_length=150)
    kargoNo=models.CharField(max_length=30)
    status=models.CharField(max_length=40)

    def __str__(self):
        return f"{self.urun.name} - {self.kargoSirketi} - {self.kargoNo} - {self.status}"
