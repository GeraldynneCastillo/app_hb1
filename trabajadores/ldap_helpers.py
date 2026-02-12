from ldap3 import Server, Connection, SIMPLE, ALL
from django.conf import settings
from contextlib import contextmanager

# El "Motor" de Conexión
@contextmanager
def get_ldap_connection():
    server = Server(
        settings.LDAP_CONFIG['HOST'],
        port=settings.LDAP_CONFIG['PORT'],
        get_info=ALL
    )
    conn = Connection(
        server,
        user=settings.LDAP_CONFIG['USER_DN'],
        password=settings.LDAP_CONFIG['PASSWORD'],
        authentication=SIMPLE,
        auto_bind=True
    )
    try:
        yield conn
    finally:
        conn.unbind()

def buscar_usuario(nombre_usuario="*"):
    # 1. Filtro de Seguridad: Solo personas, usuarios y cuentas ACTIVAS
    filtro_seguridad = "(&(objectCategory=person)(objectClass=user)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))"
    
    # 2. Filtro de Nombre: Busca en ID de usuario, nombre o apellido
    if nombre_usuario == "*" or not nombre_usuario:
        filtro_nombre = "(sAMAccountName=*)"
    else:
        # Usamos | (OR) para buscar en múltiples campos
        filtro_nombre = f"(|(sAMAccountName=*{nombre_usuario}*)(givenName=*{nombre_usuario}*)(sn=*{nombre_usuario}*))"
    
    # 3. Filtro de Limpieza y Exclusión de Externos
    filtro_limpieza = "(&(givenName=*)(sn=*))"
    filtro_excluir_externos = "(!(distinguishedName=*OU=Externos*))"

    # Construcción final del filtro
    filtro_final = f"(&{filtro_seguridad}{filtro_nombre}{filtro_limpieza}{filtro_excluir_externos})"

    with get_ldap_connection() as conn:
        conn.search(
            search_base=settings.LDAP_CONFIG['BASE_DN'],
            search_filter=filtro_final,
            attributes=['givenName', 'sn', 'mail', 'title'],
            size_limit=999 
        )
        
        resultados = []
        for e in conn.entries:
            # Función interna para extraer el valor real sin corchetes []
            def obtener_valor(atributo):
                if atributo in e and len(e[atributo].values) > 0:
                    return str(e[atributo].values[0])
                return ""

            resultados.append({
                'nombre': obtener_valor('givenName'),
                'apellido': obtener_valor('sn'),
                'email': obtener_valor('mail') or "Sin correo",
                'cargo': obtener_valor('title') or "Colaborador",
            })
            
        return resultados