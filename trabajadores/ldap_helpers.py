from ldap3 import Server, Connection, SIMPLE, ALL
from django.conf import settings
from contextlib import contextmanager


# Context manager para la conexión (igual que antes)
@contextmanager
def get_ldap_connection():
    server = Server(
        settings.LDAP_CONFIG["HOST"], port=settings.LDAP_CONFIG["PORT"], get_info=ALL
    )
    conn = Connection(
        server,
        user=settings.LDAP_CONFIG["USER_DN"],
        password=settings.LDAP_CONFIG["PASSWORD"],
        authentication=SIMPLE,
        auto_bind=True,
    )
    try:
        yield conn
    finally:
        conn.unbind()


def limpiar_jefatura(dn_jefe):
    if not dn_jefe or dn_jefe == "[]":
        return "Sin jefatura"

    # Dividimos por comas y tomamos la primera parte (CN=Nombre...)
    partes = dn_jefe.split(",")
    if partes:
        primer_dato = partes[0]
        # Quitamos el prefijo 'CN=' si existe
        if primer_dato.upper().startswith("CN="):
            return primer_dato[3:]
    return dn_jefe


def buscar_usuario(nombre_usuario="*"):
    seguridad = "(&(objectCategory=person)(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))"
    identidad_cmf = "(&(mail=*@cmf.cl)(title=*))"

    if nombre_usuario == "*" or not nombre_usuario:
        nombre_f = "(sAMAccountName=*)"
    else:
        nombre_f = f"(|(sAMAccountName=*{nombre_usuario}*)(givenName=*{nombre_usuario}*)(sn=*{nombre_usuario}*))"

    limpieza = "(&(givenName=*)(sn=*))"
    filtro_final = f"(&{seguridad}{identidad_cmf}{nombre_f}{limpieza})"

    with get_ldap_connection() as conn:
        # Agregamos 'company' y 'physicalDeliveryOfficeName' por si 'department' está vacío
        conn.search(
            search_base=settings.LDAP_CONFIG["BASE_DN"],
            search_filter=filtro_final,
            attributes=[
                "givenName",
                "sn",
                "mail",
                "title",
                "postalCode",
                "manager",
                "department",
                "company",
            ],
            size_limit=999,
        )

        resultados = []
        for e in conn.entries:

            def obtener_valor(atributo):
                if atributo in e and len(e[atributo].values) > 0:
                    val = str(e[atributo].values[0])
                    return "" if val == "[]" else val
                return ""

            # Obtenemos el manager crudo y lo limpiamos
            raw_manager = obtener_valor("manager")
            jefatura_limpia = limpiar_jefatura(raw_manager)

            # Se intenta obtener gerencia de 'department', si no, de 'company'
            gerencia = obtener_valor("department")
            resultados.append(
                {
                    "nombre": obtener_valor("givenName"),
                    "apellido": obtener_valor("sn"),
                    "email": obtener_valor("mail") or "Sin correo",
                    "cargo": obtener_valor("title") or "Colaborador",
                    "cumpleanos": obtener_valor("postalCode"),
                    "jefatura": jefatura_limpia,
                    "gerencia": gerencia or "Sin Gerencia Asignada",
                }
            )

        return resultados


def buscar_por_email(email):
    """
    Verifica si un correo existe en el Active Directory.
    Retorna True si se encuentra al menos un usuario con ese mail exacto.
    """
    filtro = f"(&(objectCategory=person)(objectClass=user)(mail={email}))"
    with get_ldap_connection() as conn:
        conn.search(
            search_base=settings.LDAP_CONFIG["BASE_DN"],
            search_filter=filtro,
            attributes=["mail"],
            size_limit=1,
        )
        return len(conn.entries) > 0
