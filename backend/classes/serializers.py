from rest_framework import serializers
from .models import Class

class ClassSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.get_full_name', read_only=True)
    student_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Class
        fields = ['id', 'name', 'subject', 'teacher', 'teacher_name', 'fee_per_month', 
                  'schedule', 'student_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_student_count(self, obj):
        return obj.students.count()
