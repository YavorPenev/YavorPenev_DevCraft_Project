from django.db import models
import os
from django.conf import settings

TYPE = (
      ('image', 'Image'),
      ('link', 'Link'),
      ('file', 'File'),
      ('note', 'note'),
)

class Library(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='libraries')
    name = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name="unique_user_name")
        ]

    def __str__(self):
        return self.name

class Sources(models.Model):
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='sources')
    type = models.CharField(choices=TYPE)
    description = models.TextField(blank=True, max_length=500)
    image = models.ImageField(upload_to='sources/images/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    file = models.FileField(upload_to='sources/files/', blank=True, null=True)
    note_title = models.CharField(max_length=255, blank=True, null=True)
    note_description = models.TextField(max_length=2000, blank=True, null=True)

    def delete(self, *args, **kwargs):
        if self.image and self.image.name and os.path.isfile(self.image.path):
            os.remove(self.image.path)
        if self.file and self.file.name and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.type} - {self.description[:30]}"