from rest_framework import serializers
from .models import Student
from classes.models import Class

class StudentSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='assigned_class.name', read_only=True, allow_null=True)
    qr_code = serializers.SerializerMethodField()
    qr_code_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = ['id', 'full_name', 'date_of_birth', 'parent_name', 
                  'parent_phone', 'parent_email', 'address', 'assigned_class', 'class_name',
                  'qr_code', 'qr_code_url', 'enrollment_date', 'is_active', 'created_at']
        read_only_fields = ['id', 'qr_code', 'qr_code_url', 'enrollment_date', 'created_at']
    
    def get_qr_code(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None
    
    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['full_name', 'date_of_birth', 'parent_name', 
                  'parent_phone', 'parent_email', 'address', 'assigned_class']
