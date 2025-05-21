from django.urls import path
from . import views

urlpatterns = [
    path('ideas/', views.idea_create, name='idea_create'),
    path('ideas/<int:pk>/', views.idea_change, name='idea_change'),
]