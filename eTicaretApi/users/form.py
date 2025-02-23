from django.contrib.auth.forms import UserChangeForm,UserCreationForm
from .models import *

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model=User
        fields='__all__'

    
    def clean_password(self):
        return self.initial["password"]

class CustomCreateForm(UserCreationForm):
    class Meta:
        model=User
        fields=['username','email','password']