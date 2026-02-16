from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Trabajador
from .serializers import TrabajadorSerializer

@api_view(['GET'])
def lista_trabajadores(request):
    """
    Vista para obtener el directorio de trabajadores.
    Permite filtrar por nombre, apellido, cargo, departamento o jefe.
    """
    # 1. Obtenemos el parámetro de búsqueda y limpiamos espacios
    query = request.GET.get('q', '').strip()

    # 2. Lógica de filtrado potente
    if query:
        # Buscamos coincidencias en el trabajador, su gerencia o su jefe
        trabajadores = Trabajador.objects.filter(
            nombre__icontains=query
        ) | Trabajador.objects.filter(
            apellido__icontains=query
        ) | Trabajador.objects.filter(
            cargo__icontains=query
        ) | Trabajador.objects.filter(
            departamento__nombre__icontains=query  # Filtra por nombre de Gerencia
        ) | Trabajador.objects.filter(
            reporta_a__nombre__icontains=query     # Filtra por nombre del Jefe
        ) | Trabajador.objects.filter(
            reporta_a__apellido__icontains=query   # También busca por apellido del jefe
        )
    else:
        # Si no hay búsqueda, traemos todos los trabajadores
        # Puedes añadir .filter(cuenta_activa=True) si quieres ocultar inactivos por defecto
        trabajadores = Trabajador.objects.all()

    # 3. Serialización optimizada
    # El TrabajadorSerializer ya se encarga de convertir reporta_a en jefe_directo
    # y departamento en gerencia_info para tu App.jsx.
    serializer = TrabajadorSerializer(trabajadores, many=True)

    # 4. Respuesta estructurada para el frontend
    return Response({
        'total': trabajadores.count(),
        'trabajadores': serializer.data  # Esta es la clave que lee tu App.jsx
    })