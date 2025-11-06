from django.urls import path
from .views import RegisterView, LoginView, CurrentUserView, TeacherListView, TeacherCreateView, TeacherDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('teachers/', TeacherListView.as_view(), name='teacher-list'),
    path('teachers/create/', TeacherCreateView.as_view(), name='teacher-create'),
    path('teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),
]
