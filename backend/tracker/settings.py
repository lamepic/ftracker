import os
import sys
from pathlib import Path


# ==================================================================================================
# ENVIRONMENT SETTINGS
# ==================================================================================================


DEV = 'dev'
STAGING = 'staging'
PRODUCTION = 'production'
TESTING = 'test' in sys.argv
ENV = os.environ.get('DJANGO_ENV', DEV)


def get(variable, default=''):
    """
    To be used over os.environ.get() to avoid deploying local/dev keys in production. Forced
    env vars to be present.
    """
    if ENV == PRODUCTION and variable not in os.environ:
        raise Exception(
            'Required environment variable not set: {}'.format(variable))

    return os.environ.get(variable, default)


# ==================================================================================================
# DJANGO SETTINGS
# ==================================================================================================

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = get('SECRET_KEY', 'local')
DEBUG = False if ENV == PRODUCTION else True
ALLOWED_HOSTS = get('ALLOWED_HOSTS', '*')


INSTALLED_APPS = [

    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party
    'rest_framework',
    'rest_framework.authtoken',
    'drfpasswordless',
    "corsheaders",
    "django_celery_results",
    "django_celery_beat",

    # Local
    'users.apps.UsersConfig',
    'core.apps.CoreConfig',
]

AUTH_USER_MODEL = "users.User"

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tracker.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tracker.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ftracker',
        'USER': 'postgres',
        'PASSWORD': 'admin123',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Media files
MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ==================================================================================================
# 3RD PARTY SETTINGS
# ==================================================================================================


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        # SessionAuthentication may interfere with mobile API requests. If you are experiencing ssues, try commenting out the following line.
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),

    'EXCEPTION_HANDLER': 'core.libs.exception_handler.custom_exception_handler'
}

# passwordless config
PASSWORDLESS_AUTH = {
    'PASSWORDLESS_AUTH_TYPES': ['EMAIL'],
    'PASSWORDLESS_EMAIL_NOREPLY_ADDRESS': 'noreply@cocobod.com.gh',
    'PASSWORDLESS_REGISTER_NEW_USERS': False,
    # 'PASSWORDLESS_TOKEN_GENERATION_ATTEMPTS': 3,
}

WEB_URL = get('WEB_URL', 'http://localhost:3000')

CORS_ALLOW_ALL_ORIGINS = True

X_FRAME_OPTIONS = 'ALLOWALL'

# CELERY SETTINGS
CELERY_BROKER_URL = 'redis://127.0.0.1:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

CELERY_RESULT_BACKEND = 'django-db'

# CELERY BEAT
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# ==================================================================================================
# EMAIL SETTINGS
# ==================================================================================================

DEFAULT_FROM_EMAIL = 'hello@inputlogic.ca'  # ___CHANGEME___
DEFAULT_FROM_NAME = 'Input Logic Dev'  # ___CHANGEME___

EMAIL_HOST = get('SMTP_SERVER', 'smtp.postmarkapp.com')
EMAIL_PORT = os.environ.get('SMTP_PORT', 587)
# Required, add to Heroku config or .env file
EMAIL_HOST_USER = get('SMTP_USERNAME', None)
# Required, add to Heroku config or .env file
EMAIL_HOST_PASSWORD = get('SMTP_PASSWORD', None)
EMAIL_USE_TLS = True
