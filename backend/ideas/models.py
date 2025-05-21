from django.db import models
from django.conf import settings

class Ideas(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ideas')
    title = models.CharField(max_length= 150, null=False, unique=True)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
                             
def __str__(self):
    return self.title