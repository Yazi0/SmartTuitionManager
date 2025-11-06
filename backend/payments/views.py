from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Payment
from .serializers import PaymentSerializer
from utils.sms import send_payment_sms
from accounts.permissions import IsOwner, IsOwnerOrTeacher

class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsOwner()]
        return [IsOwnerOrTeacher()]
    
    def get_queryset(self):
        queryset = Payment.objects.all()
        student_id = self.request.query_params.get('student_id', None)
        status = self.request.query_params.get('status', None)
        
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    
    def get_permissions(self):
        if self.request.method in ['GET']:
            return [IsOwnerOrTeacher()]
        return [IsOwner()]
    
    def perform_update(self, serializer):
        instance = serializer.save()
        
        if instance.status == 'paid' and not instance.sms_sent:
            sms_sent = send_payment_sms(
                instance.student, 
                instance.get_month_display(), 
                instance.year
            )
            instance.sms_sent = sms_sent
            instance.save()

class OutstandingPaymentsView(APIView):
    permission_classes = (IsOwnerOrTeacher,)
    
    def get(self, request):
        outstanding = Payment.objects.filter(status__in=['pending', 'overdue'])
        return Response(PaymentSerializer(outstanding, many=True).data)

class MonthlyIncomeReportView(APIView):
    permission_classes = (IsOwnerOrTeacher,)
    
    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        if not month or not year:
            return Response(
                {'error': 'Month and year parameters required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payments = Payment.objects.filter(
            month=month.lower(),
            year=int(year),
            status='paid'
        )
        
        total_income = sum([p.amount for p in payments])
        
        return Response({
            'month': month,
            'year': year,
            'total_payments': payments.count(),
            'total_income': total_income,
            'payments': PaymentSerializer(payments, many=True).data
        })
