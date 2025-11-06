from rest_framework import generics, permissions
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer
from accounts.permissions import IsOwner, IsOwnerOrTeacher

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsOwner()]
        return [IsOwnerOrTeacher()]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentSerializer

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def get_permissions(self):
        if self.request.method in ['GET']:
            return [IsOwnerOrTeacher()]
        return [IsOwner()]
