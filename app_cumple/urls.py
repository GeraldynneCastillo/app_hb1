from django.contrib import admin
from django.urls import path
from trabajadores.views import lista_trabajadores, agregar_excluido, listar_excluidos, eliminar_excluido

urlpatterns = [
    path('admin/', admin.site.urls),

    # Trabajadores
    path('', lista_trabajadores),
    path('api/usuarios/', lista_trabajadores),

    # Exclusiones
    path('api/excluidos/agregar/', agregar_excluido, name='agregar_excluido'),
    path('api/excluidos/', listar_excluidos, name='listar_excluidos'),
    path('api/excluidos/<int:excluido_id>/eliminar/', eliminar_excluido, name='eliminar_excluido'),
]