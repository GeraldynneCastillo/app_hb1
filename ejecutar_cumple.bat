@echo off
echo ===================================================
echo Iniciando tarea de envio de correos - appcumple
echo Fecha y hora: %date% %time%
echo ===================================================

:: 1. Navegar a la carpeta del proyecto
echo [INFO] Entrando a la carpeta del proyecto...
cd /d "%USERPROFILE%\Desktop\appcumple"

:: Validar que la carpeta existe
if %ERRORLEVEL% neq 0 (
    echo [ERROR] No se pudo encontrar la carpeta del proyecto.
    exit /b %ERRORLEVEL%
)

:: 2. (Opcional) Activar entorno virtual
:: Si en el futuro decides usar un entorno virtual, quita los "::" de la siguiente línea:
:: call venv\Scripts\activate.bat

:: 3. Ejecutar el comando de Django
echo [INFO] Ejecutando script de Django...
python manage.py enviar_cumple_auto

:: 4. Manejo de errores para Jenkins
if %ERRORLEVEL% neq 0 (
    echo [ERROR] El script de Django fallo. Revisa si hay problemas con SMTP o LDAP.
    exit /b %ERRORLEVEL%
)

echo [INFO] Proceso finalizado con exito.
exit /b 0