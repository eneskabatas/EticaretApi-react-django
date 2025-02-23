from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from .form import *

# Register your models here.

admin.site.register(FavoriUrun)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display=('username','email','is_active')
    search_fields=('username','email')

    readonly_fields=('password',)
   
    fieldsets=(
        ('Kullanıcı Bilgileri',{
            'fields':('username','email','password','first_name','last_name','telefon','tckn','bakiye','profil_resmi')
        }),
        ('İzinler',{
            'fields':('is_active','is_magza','is_systemuser','is_superuser','groups','user_permissions')
        }),
    )
    add_fieldsets = (
        (None,{
            "classes":("wide",),
            "fields":("username","email","password1","password2")
        }),
    )

# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     form=CustomUserChangeForm
#     add_form=CustomCreateForm