from django.urls import path
from . import views

urlpatterns = [
    path('libraries/', views.library_create, name='library_create'),
    path('libraries/<int:pk>/', views.library_change, name='library_change'),
    path('libraries/<int:library_id>/sources/', views.sources_create, name='sources_create'),
    path('sources/<int:pk>/', views.sources_change, name='sources_change')
]
