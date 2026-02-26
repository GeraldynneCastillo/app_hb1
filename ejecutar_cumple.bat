@echo off

:: Obligar a Jenkins a soportar acentos, ñ
set PYTHONIOENCODING=utf-8
chcp 65001 > nul

echo ===================================================
echo Iniciando tarea de envio de correos - appcumple
echo Fecha y hora: %date% %time%
echo ===================================================

echo [INFO] Entrando a la carpeta del proyecto...
cd /d "C:\Users\gcastillor\Desktop\appcumple"

echo [INFO] Activando entorno virtual...
call venv\Scripts\activate.bat

echo [INFO] Ejecutando envio de correos automatico...
python manage.py enviar_cumple_auto

if %ERRORLEVEL% neq 0 (
    echo [ERROR] El script de Django fallo. Revisa la consola de Jenkins.
    exit /b %ERRORLEVEL%
)

echo [INFO] Tarea completada con exito.
exit /b 0