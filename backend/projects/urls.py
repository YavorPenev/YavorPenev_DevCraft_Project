from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.projectCreate, name='project_list_create'),
    path('projects/<int:pk>/', views.projectChange, name='project_detail'),
    path('projects/<int:pk>/add_user/', views.add_user_to_project, name='add_user_to_project'),
    path('projects/<int:project_id>/todos/', views.todoCreate, name='todo_list_create'),
    path('todos/<int:pk>/', views.todoChange, name='todo_change'),
    path('projects/<int:project_id>/notes/', views.noteCreate, name='note_list_create'),
    path('notes/<int:pk>/', views.noteChange, name='note_change'),
]