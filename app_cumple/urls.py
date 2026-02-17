from django.contrib import admin
from django.urls import path
# IMPORTANTE: Agregamos la nueva vista 'enviar_correos_seleccionados' aquí
from trabajadores.views import lista_trabajadores, enviar_correos_seleccionados

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Tus rutas existentes
    path('', lista_trabajadores),
    path('api/usuarios/', lista_trabajadores),
    
    # --- LA NUEVA RUTA (La puerta para el botón verde) ---
    path('api/enviar-seleccionados/', enviar_correos_seleccionados),
]