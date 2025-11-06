from django.db import models
from django.conf import settings
from students.models import Student
from classes.models import Class

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    class_attended = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        limit_choices_to={'role__in': ['owner', 'teacher']}
    )
    sms_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'class_attended', 'date']
        ordering = ['-date', '-time']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.class_attended.name} - {self.date}"
