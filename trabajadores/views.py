from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives, get_connection
from django.conf import settings
from .ldap_helpers import buscar_usuario
from email.mime.base import MIMEBase 
from email import encoders          
import os

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

@api_view(['POST'])
def enviar_correos_seleccionados(request):
    """
    Envía correos personalizados con un GIF animado embebido.
    """
    usuarios_seleccionados = request.data.get('usuarios', [])
    
    if not usuarios_seleccionados:
        return Response({'error': 'No has seleccionado a nadie.'}, status=400)

    asunto = "🎂 ¡Feliz Cumpleaños!"
    remitente = settings.EMAIL_HOST_USER
    
    # 1. Ruta al archivo GIF en tu carpeta static
    ruta_gif = os.path.join(settings.BASE_DIR, 'static', 'cumple_indef.gif')

    enviados = 0
    errores = []

    try:
        connection = get_connection()
        connection.open()

        for usuario in usuarios_seleccionados:
            email = usuario.get('email')
            nombre = usuario.get('nombre', 'Compañero/a')
            
            try:
                html_content = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
                        <div style="max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #2c3e50;">¡Feliz Cumpleaños, {nombre}! 🎂</h2>
                            <p>Hola <b>{nombre}</b>,</p>
                            <p>Te enviamos este saludo especial con mucha alegría en tu día.</p>
                            <div style="margin-top: 20px;">
                                <img src="cid:gif_animado" alt="¡Felicidades!" style="width: 100%; max-width: 500px; border-radius: 8px;">
                            </div>
                            <p style="margin-top: 20px; color: #7f8c8d; font-size: 0.9em;">
                                Que tengas un excelente día.
                            </p>
                        </div>
                    </body>
                </html>
                """
                
                msg = EmailMultiAlternatives(
                    asunto,
                    f"¡Feliz cumpleaños {nombre}!", 
                    remitente,
                    [email],
                    connection=connection
                )
                msg.attach_alternative(html_content, "text/html")
                msg.mixed_subtype = 'related'

                # 3. Adjuntar el GIF usando MIMEBase para preservar la animación
                if os.path.exists(ruta_gif):
                    with open(ruta_gif, 'rb') as f:
                        part = MIMEBase('image', 'gif')
                        part.set_payload(f.read())
                        encoders.encode_base64(part)
                        part.add_header('Content-ID', '<gif_animado>')
                        part.add_header('Content-Disposition', 'inline', filename='cumple_indef.gif')
                        msg.attach(part)
                else:
                    print(f"No se encontró el archivo en: {ruta_gif}")

                msg.send()
                enviados += 1

            except Exception as e:
                errores.append(f"Error con {email}: {str(e)}")

        connection.close()
        
    except Exception as e:
        return Response({'error': f'Error de conexión: {str(e)}'}, status=500)

    return Response({
        'mensaje': f'Se enviaron {enviados} saludos animados correctamente.',
        'errores': errores
    })