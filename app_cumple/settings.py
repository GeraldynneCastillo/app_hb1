"""
Django settings for app_cumple project.
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-wj6)-ghfve9ziy+3kma@boi-=q5ky&h0xw4o@$*(6$cffp!3zl'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# 1. Agregamos localhost y la IP local a los hosts permitidos
ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'corsheaders',  # Debe estar aquí
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'trabajadores',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # <--- DEBE IR LO MÁS ARRIBA POSIBLE
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',  # CorsMiddleware debe ir antes que este
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


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization
LANGUAGE_CODE = 'es-cl' # Cambiado a español de Chile por comodidad

TIME_ZONE = 'America/Santiago' # Ajustado a tu zona horaria

USE_I18N = True

USE_TZ = True


# --- CONFIGURACIÓN DE CORS ---
# Esto permite que tu React (puerto 5173) hable con Django (puerto 8000)
CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
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