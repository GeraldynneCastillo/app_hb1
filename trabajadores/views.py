from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ldap_helpers import buscar_usuario
from .models import ExcluidoCumpleanos


@api_view(["GET"])
def lista_trabajadores(request):
    """
    Vista que conecta al LDAP para obtener trabajadores y filtra a los excluidos vigentes.
    """
    query = request.GET.get("q", "").strip()
    try:
        termino_busqueda = query if query else "*"
        lista_ldap = buscar_usuario(termino_busqueda)

        # Solo excluir los que tienen vigente=True
        correos_excluidos = set(
            ExcluidoCumpleanos.objects.filter(vigente=True).values_list("email", flat=True)
        )

        lista_filtrada = [
            t for t in lista_ldap if t.get("email") not in correos_excluidos
        ]

    except Exception as e:
        print(f"Error con el LDAP: {e}")
        lista_filtrada = []

    return Response(
        {
            "total": len(lista_filtrada),
            "trabajadores": lista_filtrada,
        }
    )


@api_view(["POST"])
def agregar_excluido(request):
    """
    Guarda un correo en la lista de exclusión.
    """
    email = request.data.get("email")
    vigente = request.data.get("vigente", True)

    if not email:
        return Response(
            {"error": "El correo es obligatorio"}, status=status.HTTP_400_BAD_REQUEST
        )

    if ExcluidoCumpleanos.objects.filter(email=email).exists():
        return Response(
            {"error": "Este correo ya está en la lista de exclusión"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ExcluidoCumpleanos.objects.create(email=email, vigente=vigente)

    return Response(
        {"mensaje": "Exclusión guardada exitosamente"}, status=status.HTTP_201_CREATED
    )


@api_view(["GET"])
def listar_excluidos(request):
    """
    Devuelve todos los correos en la lista de exclusión.
    """
    excluidos = ExcluidoCumpleanos.objects.all().order_by("-fecha_registro")
    data = [
        {
            "id": e.id,
            "email": e.email,
            "vigente": e.vigente,
            "fecha_registro": e.fecha_registro.strftime("%d/%m/%Y %H:%M"),
        }
        for e in excluidos
    ]
    return Response({"excluidos": data})


@api_view(["DELETE"])
def eliminar_excluido(request, excluido_id):
    """
    Elimina un correo de la lista de exclusión por su id.
    """
    try:
        excluido = ExcluidoCumpleanos.objects.get(id=excluido_id)
        excluido.delete()
        return Response({"mensaje": "Correo reincorporado exitosamente"}, status=status.HTTP_200_OK)
    except ExcluidoCumpleanos.DoesNotExist:
        return Response({"error": "Registro no encontrado"}, status=status.HTTP_404_NOT_FOUND)
