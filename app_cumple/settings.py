"""
Configuraciones de Django para el proyecto app_cumple.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-wj6)-ghfve9ziy+3kma@boi-=q5ky&h0xw4o@$*(6$cffp!3zl'

DEBUG = True

# Se agregan localhost y la IP de red para permitir el acceso desde otros equipos
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '172.19.7.106', '0.0.0.0']


# Definición de la aplicación

INSTALLED_APPS = [
    'corsheaders',  # Manejo de intercambio de recursos de origen cruzado
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'trabajadores',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'app_cumple.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'app_cumple.wsgi.application'


# Base de datos
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Validación de contraseñas
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


LANGUAGE_CODE = 'es-cl' 

TIME_ZONE = 'America/Santiago' 

USE_I18N = True

USE_TZ = True


# --- CONFIGURACIÓN DE CORS ---
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True


# Archivos estáticos (CSS, JavaScript, Imágenes)
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Configuración LDAP 
LDAP_CONFIG = {
    'HOST': 'cmfad1',
    'PORT': 389,
    'BASE_DN': 'DC=cmf,DC=cl',
    'USER_DN': 'totem@cmf.cl',
    'PASSWORD': 'Martina_0390.-',
}

# Configuración de correo (SMTP)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = LDAP_CONFIG['USER_DN'] 
EMAIL_HOST_PASSWORD = LDAP_CONFIG['PASSWORD']
DEFAULT_FROM_EMAIL = LDAP_CONFIG['USER_DN']