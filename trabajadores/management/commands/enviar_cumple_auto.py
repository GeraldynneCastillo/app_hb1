import os
import time  # Para evitar el bloqueo por spam
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from email.mime.base import MIMEBase
from email import encoders
from trabajadores.ldap_helpers import buscar_usuario 

class Command(BaseCommand):
    help = 'Envía correos automáticos únicamente a los cumpleañeros del día de hoy'

    def handle(self, *args, **options):
        # 1. Obtener todos los trabajadores del LDAP
        self.stdout.write("Buscando trabajadores en LDAP...")
        trabajadores = buscar_usuario("*")
        
        # 2. Definir fecha de interés (solo hoy)
        hoy = datetime.now().strftime("%d/%m") 
        self.stdout.write(f"Buscando coincidencias para la fecha de hoy: {hoy}")
        
        cumpleañeros = []
        for t in trabajadores:
            fecha_str = t.get('cumpleanos', '')
            nombre = t.get('nombre', 'Sin nombre')
            if fecha_str:
                self.stdout.write(f"Revisando: {nombre} | Fecha LDAP: {fecha_str}")
                if hoy in fecha_str:
                    self.stdout.write(self.style.SUCCESS(f"¡Coincidencia encontrada para {nombre}!"))
                    cumpleañeros.append(t)
        if not cumpleañeros:
            self.stdout.write(self.style.WARNING(f"No hay cumpleaños para procesar hoy ({hoy})."))
            return

        # 3. Lógica de envío de correos
        self.stdout.write(f"Iniciando envío de correos a {len(cumpleañeros)} personas...")
        self.enviar_correos(cumpleañeros)

    def enviar_correos(self, cumpleañeros):
        asunto = "🎂 ¡Feliz Cumpleaños!"
        remitente = settings.EMAIL_HOST_USER
        ruta_gif = os.path.join(settings.BASE_DIR, 'static', 'cumple_indef.gif')    
        # COOOOOOPIA OCULTAAAAAA PRUEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        correos_bcc = ["dreyes@cmf.cl"] 

        try:
            connection = get_connection()
            connection.open()
            for t in cumpleañeros:
                email_destinatario = t.get('email')
                nombre = t.get('nombre', 'Compañero/a')
                if not email_destinatario or email_destinatario in ["Sin correo", "[]"]:
                    self.stdout.write(self.style.ERROR(f"Saltando a {nombre}: No tiene correo válido."))
                    continue
                html_content = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h2 style="color: #2c3e50;">¡Feliz Cumpleaños, {nombre}! 🎂</h2>
                        <p style="font-size: 16px;">Te enviamos este saludo especial con mucha alegría en tu día.</p>
                        <br>
                        <img src="cid:gif_animado" style="width: 100%; max-width: 500px; border-radius: 10px;">
                    </body>
                </html>
                """
                # Creamos el mensaje con soporte para BCC
                msg = EmailMultiAlternatives(
                    subject=asunto, 
                    body=f"¡Feliz cumpleaños {nombre}!", 
                    from_email=remitente, 
                    to=[email_destinatario],
                    bcc=correos_bcc,  # <-- Aquí se aplica la copia oculta
                    connection=connection
                )
                msg.attach_alternative(html_content, "text/html")
                msg.subtype = 'related'

                # Adjuntar el GIF si existe
                if os.path.exists(ruta_gif):
                    with open(ruta_gif, 'rb') as f:
                        part = MIMEBase('image', 'gif')
                        part.set_payload(f.read())
                        encoders.encode_base64(part)
                        part.add_header('Content-ID', '<gif_animado>')
                        part.add_header('Content-Disposition', 'inline', filename='cumple_indef.gif')
                        msg.attach(part)
                else:
                    self.stdout.write(self.style.WARNING(f"Aviso: No se encontró el GIF en {ruta_gif}"))
                # Enviar correo individual
                msg.send()
                self.stdout.write(self.style.SUCCESS(f"✅ Correo enviado a: {email_destinatario}"))
                # Pausa de seguridad: Si hay más de un cumpleañero, esperamos 5 segundos
                # Esto evita que Outlook nos bloquee por envío masivo (Spam)
                if len(cumpleañeros) > 1:
                    self.stdout.write("Esperando 5 segundos para el siguiente envío...")
                    time.sleep(5)
            connection.close()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error crítico en la conexión de correo: {e}"))