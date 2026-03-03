from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ldap_helpers import buscar_usuario, buscar_por_email
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
    email = request.data.get("email", "").strip().lower()
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

    try:
        existe_en_ad = buscar_por_email(email)
    except Exception as e:
        print(f"Error consultando el LDAP: {e}")
        existe_en_ad = False

    if not existe_en_ad:
        return Response(
            {"error": "El correo no corresponde a ningún colaborador registrado en el sistema."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ExcluidoCumpleanos.objects.create(email=email, vigente=vigente)

    return Response(
        {"mensaje": "Registro guardado exitosamente"}, status=status.HTTP_201_CREATED
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


@api_view(["GET"])
def verificar_excluido(request):
    """
    Verifica si un correo ya existe en la lista de exclusión.
    Retorna: { existe: bool, id: int|null, vigente: bool|null }
    """
    email = request.GET.get("email", "").strip().lower()
    if not email:
        return Response({"error": "Param\u00e9tro email requerido"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        excluido = ExcluidoCumpleanos.objects.get(email=email)
        return Response({"existe": True, "id": excluido.id, "vigente": excluido.vigente})
    except ExcluidoCumpleanos.DoesNotExist:
        return Response({"existe": False, "id": None, "vigente": None})


@api_view(["PATCH"])
def actualizar_excluido(request, excluido_id):
    """
    Actualiza el campo vigente de un registro existente.
    """
    try:
        excluido = ExcluidoCumpleanos.objects.get(id=excluido_id)
    except ExcluidoCumpleanos.DoesNotExist:
        return Response({"error": "Registro no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    vigente = request.data.get("vigente")
    if vigente is None:
        return Response({"error": "El campo vigente es requerido"}, status=status.HTTP_400_BAD_REQUEST)

    excluido.vigente = vigente
    excluido.save()
    return Response({"mensaje": "Registro actualizado exitosamente"}, status=status.HTTP_200_OK)
