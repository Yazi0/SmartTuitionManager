from django.urls import path
from .views import (
    PaymentListCreateView, 
    PaymentDetailView, 
    OutstandingPaymentsView,
    MonthlyIncomeReportView
)

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('outstanding/', OutstandingPaymentsView.as_view(), name='outstanding-payments'),
    path('monthly-income/', MonthlyIncomeReportView.as_view(), name='monthly-income'),
]
