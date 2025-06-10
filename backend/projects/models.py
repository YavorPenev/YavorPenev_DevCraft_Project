from django.db import models
from django.conf import settings

class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_projects', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)
    technologies = models.ManyToManyField(Technology, blank=True, related_name='projects')
    dependencies = models.TextField(blank=True)
    github_link = models.URLField(blank=True, null=True)
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='shared_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def owner_or_shared(self, user):
        return self.owner == user or self.shared_with.filter(pk=user.pk).exists()

class Note(models.Model):
    project = models.ForeignKey(Project, related_name='notes', on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title}: {self.project.name}'

class PersonalDependency(models.Model):
    project = models.ForeignKey(Project, related_name='personal_dependencies', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    value = models.TextField()

    def __str__(self):
        return f'{self.name} ({self.project.name})'

class ToDoItem(models.Model):
    project = models.ForeignKey(Project, related_name='todo_items', on_delete=models.CASCADE)
    date = models.DateField()
    task = models.TextField()
    state = models.BooleanField(default=False)
    class Meta:
        unique_together = ('project', 'date', 'task')

    def __str__(self):
        return f'Task-{self.project.name}:{self.date}: {self.task}'
class Message(models.Model):
    project = models.ForeignKey(Project, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['created_at']
