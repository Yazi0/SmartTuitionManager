from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    class_name = serializers.CharField(source='class_fee.name', read_only=True)
    received_by_name = serializers.CharField(source='received_by.get_full_name', read_only=True)
    month_display = serializers.CharField(source='get_month_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_name', 'class_fee', 'class_name', 'month', 
                  'month_display', 'year', 'amount', 'status', 'payment_date', 
                  'received_by', 'received_by_name', 'sms_sent', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sms_sent', 'created_at', 'updated_at']
