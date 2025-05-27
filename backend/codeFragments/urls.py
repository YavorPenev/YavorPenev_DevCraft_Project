from django.urls import path
from . import views

urlpatterns = [
    path('codeLibraries/', views.codeLibrary_create, name='codeLibrary_create'),
    path('codeLibraries/<int:pk>/', views.codeLibrary_change, name='codeLibrary_change'),
    path('codeLibraries/<int:codeLibrary_id>/fragments/', views.fragments_create, name='fragments_create'),
    path('fragments/<int:pk>/', views.fragments_change, name='fragments_change')
]
