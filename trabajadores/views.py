from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ldap_helpers import buscar_usuario

@api_view(['GET'])
def lista_trabajadores(request):
    """
    Vista que conecta directamente al LDAP para obtener trabajadores.
    Reemplaza la consulta a la base de datos local para traer datos en vivo.
    """
    # 1. Obtener el término de búsqueda de la URL (ej: ?q=juan)
    query = request.GET.get('q', '').strip()

    # 2. Buscar en LDAP usando tu helper existente
    # Si no hay query, enviamos "*" para traer todos los usuarios.
    try:
        termino_busqueda = query if query else "*"
        lista_ldap = buscar_usuario(termino_busqueda)
    except Exception as e:
        print(f"Error conectando al LDAP: {e}")
        lista_ldap = []

    # 3. Retornar la respuesta en el formato exacto que App.jsx espera
    # App.jsx espera un objeto con la clave 'trabajadores'
    return Response({
        'total': len(lista_ldap),
        'trabajadores': lista_ldap
    })