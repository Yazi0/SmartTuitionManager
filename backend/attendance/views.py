from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from .models import Attendance
from .serializers import AttendanceSerializer, MarkAttendanceSerializer
from utils.sms import send_attendance_sms
from accounts.permissions import IsOwnerOrTeacher

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = (IsOwnerOrTeacher,)
    
    def get_queryset(self):
        queryset = Attendance.objects.all()
        date = self.request.query_params.get('date', None)
        class_id = self.request.query_params.get('class_id', None)
        student_id = self.request.query_params.get('student_id', None)
        
        if date:
            queryset = queryset.filter(date=date)
        if class_id:
            queryset = queryset.filter(class_attended_id=class_id)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        return queryset

class MarkAttendanceView(APIView):
    permission_classes = (IsOwnerOrTeacher,)
    
    def post(self, request):
        serializer = MarkAttendanceSerializer(data=request.data)
        
        if serializer.is_valid():
            student = serializer.validated_data['qr_data']['student']
            
            if not student.assigned_class:
                return Response(
                    {'error': 'Student is not assigned to any class'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            today = timezone.now().date()
            attendance, created = Attendance.objects.get_or_create(
                student=student,
                class_attended=student.assigned_class,
                date=today,
                defaults={'marked_by': request.user}
            )
            
            if not created:
                return Response(
                    {'message': 'Attendance already marked for today'}, 
                    status=status.HTTP_200_OK
                )
            
            sms_sent = send_attendance_sms(student, student.assigned_class.name)
            attendance.sms_sent = sms_sent
            attendance.save()
            
            return Response(
                AttendanceSerializer(attendance).data, 
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DailyReportView(APIView):
    permission_classes = (IsOwnerOrTeacher,)
    
    def get(self, request):
        date_str = request.query_params.get('date', None)
        if date_str:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        else:
            date = timezone.now().date()
        
        if request.user.role == 'teacher':
            attendances = Attendance.objects.filter(
                date=date,
                class_attended__teacher=request.user
            )
        else:
            attendances = Attendance.objects.filter(date=date)
        
        total_students = attendances.count()
        total_income = sum([a.class_attended.fee_per_month / 30 for a in attendances])
        
        return Response({
            'date': date,
            'total_students': total_students,
            'total_income': round(total_income, 2),
            'attendances': AttendanceSerializer(attendances, many=True).data
        })
