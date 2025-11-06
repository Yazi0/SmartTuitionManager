from django.urls import path
from .views import AttendanceListView, MarkAttendanceView, DailyReportView

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance-list'),
    path('mark/', MarkAttendanceView.as_view(), name='mark-attendance'),
    path('daily-report/', DailyReportView.as_view(), name='daily-report'),
]
