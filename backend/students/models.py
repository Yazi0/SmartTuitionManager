from django.db import models
from django.conf import settings
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image
import os

class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
    )
    full_name = models.CharField(max_length=200)
    date_of_birth = models.DateField()
    parent_name = models.CharField(max_length=200)
    parent_phone = models.CharField(max_length=15)
    parent_email = models.EmailField(blank=True)
    address = models.TextField()
    assigned_class = models.ForeignKey(
        'classes.Class', 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='students'
    )
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    enrollment_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.full_name
    
    def generate_qr_code(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr_data = f"STUDENT:{self.id}:{self.full_name}"
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, 'PNG')
        buffer.seek(0)
        
        filename = f'student_{self.id}_qr.png'
        self.qr_code.save(filename, File(buffer), save=False)
        buffer.close()
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new or not self.qr_code:
            self.generate_qr_code()
            super().save(update_fields=['qr_code'])
