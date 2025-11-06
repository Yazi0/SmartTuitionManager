from django.db import models
from django.conf import settings
from students.models import Student
from classes.models import Class

class Payment(models.Model):
    MONTH_CHOICES = (
        ('january', 'January'),
        ('february', 'February'),
        ('march', 'March'),
        ('april', 'April'),
        ('may', 'May'),
        ('june', 'June'),
        ('july', 'July'),
        ('august', 'August'),
        ('september', 'September'),
        ('october', 'October'),
        ('november', 'November'),
        ('december', 'December'),
    )
    
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('pending', 'Pending'),
        ('overdue', 'Overdue'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payments')
    class_fee = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='payments')
    month = models.CharField(max_length=15, choices=MONTH_CHOICES)
    year = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        limit_choices_to={'role__in': ['owner', 'teacher']}
    )
    sms_sent = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['student', 'class_fee', 'month', 'year']
        ordering = ['-year', '-created_at']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.month} {self.year} - {self.status}"
