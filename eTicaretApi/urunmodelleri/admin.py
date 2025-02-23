from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Category)
admin.site.register(Urunler)
admin.site.register(Renk)
admin.site.register(UPuan)
admin.site.register(Beden)
admin.site.register(Comment)
admin.site.register(Sepet)
admin.site.register(SepetUrunleri)
admin.site.register(KargoTakip)