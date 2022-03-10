from django.urls import path
from rest_framework import routers

from .api import views

app_name = "core"

urlpatterns = [
    path("auth/logout/", views.LogoutAPIView.as_view(), name="logout"),
    path("auth/login/", views.StaffIDLoginAPIView.as_view(), name="login"),

    path('incoming/', views.IncomingAPIView.as_view(),
         name='incoming'),
    path('incoming/<document_id>/', views.IncomingAPIView.as_view(),
         name='incoming_document'),
    path('incoming-count/', views.IncomingCountAPIView.as_view(),
         name='incoming-count'),

    path('outgoing-count/', views.OutgoingCountAPIView.as_view(),
         name='outgoing-count'),
    path('outgoing/', views.OutgoingAPIView.as_view(),
         name='outgoing'),

    path('document/<int:id>/', views.DocumentAPIView.as_view(), name='document'),
    path('minutes/<int:document_id>/',
         views.MinuteAPIView.as_view(), name='minute'),

    path('archive/', views.ArchiveAPIView.as_view(),
         name='archive'),
    path('archive-count/', views.ArchiveCountAPIView.as_view(),
         name='archive_count'),
    path('archive/<user_id>/', views.ArchiveAPIView.as_view(),
         name='archive'),

    path('mark-complete/<int:id>/',
         views.MarkCompleteAPIView.as_view(), name='mark_complete'),
    path('tracking/<document_id>/',
         views.TrackingAPIView.as_view(), name='tracking'),
    path('preview-code/<user_id>/<document_id>/',
         views.PreviewCodeAPIView.as_view(), name='preview_code'),

    path('document-type/', views.DocumentTypeAPIView.as_view(), name='document_type'),
    path('document-action/',
         views.DocumentActionAPIView.as_view(), name='document-action'),
    path('document-action/<document_type_id>/',
         views.DocumentActionAPIView.as_view(), name='document-action'),

    path('forward-document/', views.ForwardDocumentAPIView.as_view(),
         name='forward-document'),
    path('forward-document/<document_id>/', views.ForwardDocumentAPIView.as_view(),
         name='forward-document'),

    path('request-document/', views.RequestDocumentAPIView.as_view(),
         name='request_document'),
    path('notifications/', views.NotificationsCountAPIView.as_view(),
         name='notifications'),

    path('activate-document/', views.ActivateDocument.as_view(),
         name='activate_document'),
    path('create-flow/', views.CreateFlow.as_view(),
         name='create-flow'),
    path('search/<term>/', views.SearchAPIView.as_view(), name='search'),
    path('create-document/', views.CreateDocument.as_view(), name='create_document'),

    path('folders/', views.FolderAPIView.as_view(), name='folders'),
    path('folders/<slug>/', views.FolderAPIView.as_view(), name='folders'),
]
