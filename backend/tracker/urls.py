from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from users.api import views

urlpatterns = [
    path('', include('drfpasswordless.urls')),
    path('admin/', admin.site.urls),

    # User App urls
    path('api/v1/user/', views.UserAPIView.as_view(), name='user'),
    path('api/v1/users/', views.UsersAPIView.as_view(), name='users'),
    path('api/v1/departments/', views.DepartmentAPIView.as_view(), name='departments'),

    # Core App urls
    path('api/v1/', include('core.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATICFILES_DIRS)
