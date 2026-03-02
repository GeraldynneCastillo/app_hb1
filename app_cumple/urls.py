from django.contrib import admin
from django.urls import path
from trabajadores.views import lista_trabajadores, agregar_excluido

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # rutas existentes
    path('', lista_trabajadores),
    path('api/usuarios/', lista_trabajadores),
    path('api/excluidos/agregar/', agregar_excluido, name='agregar_excluido'),
]