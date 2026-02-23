from django.contrib import admin
from django.urls import path
from trabajadores.views import lista_trabajadores, enviar_correos_seleccionados

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # rutas existentes
    path('', lista_trabajadores),
    path('api/usuarios/', lista_trabajadores),
    
    # envio de correos manualmente
    path('api/enviar-seleccionados/', enviar_correos_seleccionados),
]