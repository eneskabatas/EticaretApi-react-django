"""ETicaretApi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from magza.views import *
from users.views import *
from urunmodelleri.views import *
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView,TokenVerifyView
from django.conf import settings
from django.conf.urls.static import static
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi



router=DefaultRouter()
############ MAĞZA #########
router.register(r'magza',MagzaViewSet,basename='magzaViewSet')
router.register(r'banka',BankaViewSet,basename='bankaViewSet')
router.register(r'mpuan',MPuanViewSet,basename='mPuanViewSet')
router.register(r'mcomment',MCommentViewSet,basename='mCommentViewSet')
router.register(r'sistem',SistemBakiyeViewSet,basename='sistemBakiyeViewSet')
########### Urunler #########
router.register(r'sepet',SepetViewSet,basename='sepetViewSet')
router.register(r'category',CategoryViewSet,basename="categoryViewSet")
router.register(r'beden',BedenViewSet,basename="bedenViewSet")
router.register(r'renk',RenkViewSet,basename="RenkViewSet")
router.register(r'urunler',UrunlerViewSet,basename="urunlerViewSet")
router.register(r'ucomment',UCommentViewSet,basename="uCommentViewSet")
router.register(r'upuan',UPuanViewSet,basename="uPuanViewSet")
router.register(r'kargotakip',KargoTakipViewSet,basename="kargoTakipViewSet")
######### User ########
router.register(r'user',UserViewSets,basename="userViewSet")
router.register(r'favori',FavoriUrunViewSet,basename="favoriUrunViewSet")
router.register(r'adress',AdresViewSet,basename="adresViewSet")
router.register(r'register',RegisterViewSet,basename="registerViewSet")


# schema_view = get_schema_view(
#     openapi.Info(
#         title="Proje API Dokümantasyonu",
#         default_version='v1',
#         description="Projenizin açıklaması buraya",
#     ),
#     public=True,
#     permission_classes=(permissions.AllowAny,),
# )


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include(router.urls)),
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('api/token/refresh/',TokenRefreshView.as_view(),name="token_refresh"),
    path('api/token/verify/',TokenVerifyView.as_view(),name="token_verify"),

]
urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
