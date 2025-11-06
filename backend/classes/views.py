from rest_framework import generics, permissions
from .models import Class
from .serializers import ClassSerializer
from accounts.permissions import IsOwner, IsOwnerOrTeacher

class ClassListCreateView(generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsOwner()]
        return [IsOwnerOrTeacher()]

class ClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    
    def get_permissions(self):
        if self.request.method in ['GET']:
            return [IsOwnerOrTeacher()]
        return [IsOwner()]
