from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ldap_helpers import buscar_usuario
from .models import ExcluidoCumpleanos  # Importamos tu nuevo modelo


@api_view(["GET"])
def lista_trabajadores(request):
    """
    Vista que conecta al LDAP para obtener trabajadores y filtra a los excluidos.
    """
    query = request.GET.get("q", "").strip()
    try:
        termino_busqueda = query if query else "*"
        lista_ldap = buscar_usuario(termino_busqueda)

        # --- NUEVO: Obtener correos excluidos y filtrar ---
        correos_excluidos = set(
            ExcluidoCumpleanos.objects.values_list("email", flat=True)
        )

        # Guardamos en lista_filtrada solo a los que NO están en los excluidos
        lista_filtrada = [
            t for t in lista_ldap if t.get("email") not in correos_excluidos
        ]

    except Exception as e:
        print(f"Error con el LDAP: {e}")
        lista_filtrada = []

    return Response(
        {
            "total": len(lista_filtrada),
            "trabajadores": lista_filtrada,  # Ahora devolvemos la lista filtrada
        }
    )


# --- NUEVA VISTA PARA EL FORMULARIO ---
@api_view(["POST"])
def agregar_excluido(request):
    """
    Vista para guardar un correo en la tabla de excluidos (SQL Server) desde React.
    """
    email = request.data.get("email")
    motivo = request.data.get("motivo", "Sin motivo especificado")
    if not email:
        return Response(
            {"error": "El correo es obligatorio"}, status=status.HTTP_400_BAD_REQUEST
        )
    # Evitar guardar correos duplicados
    if ExcluidoCumpleanos.objects.filter(email=email).exists():
        return Response(
            {"error": "Este correo ya está en la lista de exclusión"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    # Guardar en la BD de SQL Server
    ExcluidoCumpleanos.objects.create(email=email, motivo=motivo)

    return Response(
        {"mensaje": "Usuario excluido exitosamente"}, status=status.HTTP_201_CREATED
    )
