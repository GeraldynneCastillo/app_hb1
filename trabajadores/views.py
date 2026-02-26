from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ldap_helpers import buscar_usuario

@api_view(['GET'])
def lista_trabajadores(request):
    """
    Vista que conecta al LDAP para obtener trabajadores.
    """
    query = request.GET.get('q', '').strip()
    try:
        termino_busqueda = query if query else "*"
        lista_ldap = buscar_usuario(termino_busqueda)
    except Exception as e:
        print(f"Error con el LDAP: {e}")
        lista_ldap = []

    return Response({
        'total': len(lista_ldap),
        'trabajadores': lista_ldap
    })