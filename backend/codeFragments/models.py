from django.db import models
from django.conf import settings

class CodeLibrary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="code_library")
    language = models.CharField(blank=False, max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'language'], name="unique_user_language")
        ]

    def __str__(self):
        return self.language

class CodeFragment(models.Model):
    codeLibrary = models.ForeignKey(CodeLibrary, on_delete=models.CASCADE, related_name="code_fragments")
    title = models.CharField( blank=False, max_length=250)
    code = models.TextField(blank=False)
    description = models.TextField(blank=True, max_length=3000)
    date =models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['codeLibrary', 'title'], name="unique_codeLibrary_title")
        ]

    def __str__(self):
        return self.title