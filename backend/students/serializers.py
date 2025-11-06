from rest_framework import serializers
from .models import Student
from classes.models import Class

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class_name = serializers.CharField(source='assigned_class.name', read_only=True)
    qr_code_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = ['id', 'user', 'username', 'full_name', 'date_of_birth', 'parent_name', 
                  'parent_phone', 'parent_email', 'address', 'assigned_class', 'class_name',
                  'qr_code', 'qr_code_url', 'enrollment_date', 'is_active', 'created_at']
        read_only_fields = ['id', 'qr_code', 'enrollment_date', 'created_at']
    
    def get_qr_code_url(self, obj):
        if obj.qr_code:
            return obj.qr_code.url
        return None

class StudentCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Student
        fields = ['username', 'password', 'full_name', 'date_of_birth', 'parent_name', 
                  'parent_phone', 'parent_email', 'address', 'assigned_class']
    
    def create(self, validated_data):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            username=username,
            password=password,
            role='student'
        )
        
        student = Student.objects.create(user=user, **validated_data)
        return student
