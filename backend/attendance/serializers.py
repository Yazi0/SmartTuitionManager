from rest_framework import serializers
from .models import Attendance
from students.models import Student

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    class_name = serializers.CharField(source='class_attended.name', read_only=True)
    marked_by_name = serializers.CharField(source='marked_by.get_full_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'class_attended', 'class_name', 
                  'date', 'time', 'marked_by', 'marked_by_name', 'sms_sent', 'created_at']
        read_only_fields = ['id', 'date', 'time', 'sms_sent', 'created_at']

class MarkAttendanceSerializer(serializers.Serializer):
    qr_data = serializers.CharField()
    
    def validate_qr_data(self, value):
        try:
            parts = value.split(':')
            if len(parts) != 3 or parts[0] != 'STUDENT':
                raise serializers.ValidationError("Invalid QR code format")
            
            student_id = int(parts[1])
            student = Student.objects.get(id=student_id)
            return {'student': student}
        except (ValueError, Student.DoesNotExist):
            raise serializers.ValidationError("Invalid student QR code")
