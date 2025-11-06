from django.db import models
from django.conf import settings

class Class(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='classes_taught',
        limit_choices_to={'role': 'teacher'}
    )
    fee_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    schedule = models.CharField(max_length=200, help_text="e.g., Mon/Wed/Fri 4-6 PM")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Classes"
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
