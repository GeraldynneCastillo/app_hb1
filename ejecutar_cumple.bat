@echo off
:: Navegar a la carpeta del proyecto en tu Escritorio
cd /d "%USERPROFILE%\Desktop\appcumple"

:: Ejecutar el comando de Django directamente
:: (Asumiendo que usas el Python global de tu sistema)
python manage.py enviar_cumple_auto

exit