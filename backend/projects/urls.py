from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.projectCreate, name='project_list_create'),
    path('projects/<int:pk>/', views.projectChange, name='project_detail'),
    path('projects/<int:pk>/add_user/', views.add_user_to_project, name='add_user_to_project'),
]