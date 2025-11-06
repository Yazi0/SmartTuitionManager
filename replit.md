# Smart Tuition Manager

## Overview
A comprehensive Student Management System for private tuition classes built with Django REST Framework (backend) and React (frontend). The system enables role-based management for Owners, Teachers, and Students with features including QR code-based attendance tracking, payment management, and automated SMS notifications to parents.

## Project Status
**Current State**: Backend API and basic frontend authentication are fully implemented and running.

**Last Updated**: November 6, 2025

## Recent Changes
- **November 6, 2025**: Initial project setup complete with security hardening
  - Django backend with REST API fully configured
  - React frontend with authentication and routing set up
  - Database models created for User, Student, Class, Attendance, and Payment
  - JWT authentication implemented
  - **Role-based access control (RBAC) implemented**:
    - Custom permission classes: IsOwner, IsOwnerOrTeacher, IsTeacher
    - Registration forced to 'student' role - prevents privilege escalation
    - Teacher creation restricted to owners only
    - All management APIs (students, classes, payments) require owner permissions
    - Attendance operations require owner or teacher permissions
  - QR code generation functionality added
  - Twilio SMS integration configured
  - Basic Owner and Teacher dashboards created

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS + Shadcn UI components
- **Backend**: Django 4.2.7 + Django REST Framework
- **Database**: SQLite (db.sqlite3)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **QR Codes**: Python qrcode library
- **SMS**: Twilio API
- **Development Server**: Django runs on port 8000, React/Vite runs on port 5000

## Project Architecture

### Backend Structure (`/backend`)
```
backend/
├── tuition_manager/         # Main Django project
│   ├── settings.py          # Project settings with CORS, JWT, Twilio config
│   └── urls.py              # Main URL routing
├── accounts/                # User authentication and management
│   ├── models.py            # Custom User model with roles
│   ├── serializers.py       # User, Register, Teacher serializers
│   ├── views.py             # Login, Register, Current User endpoints
│   └── urls.py              # Auth routes
├── students/                # Student management
│   ├── models.py            # Student model with QR code generation
│   ├── serializers.py       # Student serializers
│   ├── views.py             # Student CRUD endpoints
│   └── urls.py              # Student routes
├── classes/                 # Class management
│   ├── models.py            # Class model
│   ├── serializers.py       # Class serializers
│   ├── views.py             # Class CRUD endpoints
│   └── urls.py              # Class routes
├── attendance/              # Attendance tracking
│   ├── models.py            # Attendance model
│   ├── serializers.py       # Attendance and QR scanning serializers
│   ├── views.py             # Attendance marking and daily reports
│   └── urls.py              # Attendance routes
├── payments/                # Payment management
│   ├── models.py            # Payment model
│   ├── serializers.py       # Payment serializers
│   ├── views.py             # Payment CRUD and reports
│   └── urls.py              # Payment routes
└── utils/                   # Utilities
    └── sms.py               # Twilio SMS helper functions
```

### Frontend Structure (`/frontend`)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components (to be added)
│   ├── pages/
│   │   ├── Login.jsx        # Login page
│   │   ├── OwnerDashboard.jsx    # Owner dashboard (basic)
│   │   └── TeacherDashboard.jsx  # Teacher dashboard (basic)
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication context and state
│   ├── utils/
│   │   └── api.js           # Axios instance with JWT interceptors
│   ├── lib/
│   │   └── utils.js         # Utility functions (cn for classnames)
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind CSS with custom theme
├── vite.config.js           # Vite configuration with proxy to Django
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Node dependencies
```

## Database Models

### User (Custom AbstractUser)
- Fields: username, email, password, role (owner/teacher/student), phone
- Roles: Owner, Teacher, Student

### Student
- Fields: user (OneToOne), full_name, date_of_birth, parent_name, parent_phone, parent_email, address, assigned_class, qr_code (auto-generated), enrollment_date, is_active
- Auto-generates QR code on creation: format `STUDENT:{id}:{name}`

### Class
- Fields: name, subject, teacher (ForeignKey to User), fee_per_month, schedule, created_at, updated_at

### Attendance
- Fields: student, class_attended, date, time, marked_by, sms_sent
- Unique constraint: student + class + date (prevents duplicate attendance)
- Triggers SMS notification to parent when marked

### Payment
- Fields: student, class_fee, month, year, amount, status (paid/pending/overdue), payment_date, received_by, sms_sent, notes
- Unique constraint: student + class + month + year
- Triggers SMS notification when status changes to 'paid'

## API Endpoints

### Authentication (`/api/auth/`)
- POST `/register/` - Register new user
- POST `/login/` - Login and get JWT token
- GET `/me/` - Get current user info
- GET `/teachers/` - List all teachers
- POST `/teachers/create/` - Create new teacher (Owner only)

### Students (`/api/students/`)
- GET `/` - List all students
- POST `/` - Create new student (with auto QR generation)
- GET `/{id}/` - Get student details
- PUT `/{id}/` - Update student
- DELETE `/{id}/` - Delete student

### Classes (`/api/classes/`)
- GET `/` - List all classes
- POST `/` - Create new class
- GET `/{id}/` - Get class details
- PUT `/{id}/` - Update class
- DELETE `/{id}/` - Delete class

### Attendance (`/api/attendance/`)
- GET `/` - List attendance (filterable by date, class, student)
- POST `/mark/` - Mark attendance by scanning QR code
- GET `/daily-report/` - Get daily attendance and income report

### Payments (`/api/payments/`)
- GET `/` - List payments (filterable by student, status)
- POST `/` - Create payment record
- GET `/{id}/` - Get payment details
- PUT `/{id}/` - Update payment (triggers SMS if status = 'paid')
- DELETE `/{id}/` - Delete payment
- GET `/outstanding/` - Get all outstanding payments
- GET `/monthly-income/` - Get monthly income report (requires month & year params)

## Environment Variables Required
- `SESSION_SECRET` - Django secret key (already configured)
- `TWILIO_ACCOUNT_SID` - Twilio account SID (needed for SMS)
- `TWILIO_AUTH_TOKEN` - Twilio auth token (needed for SMS)
- `TWILIO_PHONE_NUMBER` - Twilio phone number (needed for SMS)

## Next Steps (Tasks 7-10)
1. **Task 7**: Build complete Owner dashboard with:
   - Student management UI (add, edit, delete, view QR codes)
   - Teacher management UI
   - Class management UI
   - Payment tracking and update UI
   - Comprehensive reports

2. **Task 8**: Build complete Teacher dashboard with:
   - QR code scanner component
   - Attendance marking interface
   - Daily student list view
   - Daily income calculator

3. **Task 9**: Implement reporting features:
   - Attendance summary by date/class/student
   - Monthly and daily income reports with charts
   - Outstanding payments list
   - Export functionality (PDF/Excel)

4. **Task 10**: Final testing and integration:
   - Test all CRUD operations
   - Verify SMS notifications work
   - Test QR code generation and scanning
   - Ensure proper role-based access control
   - Performance testing

## User Preferences
- **Stack**: Django + React (as requested)
- **Database**: SQLite (as requested)
- **UI Framework**: TailwindCSS with Shadcn components (modern, professional design)

## Development Notes
- Both backend and frontend run simultaneously via the workflow
- Vite dev server proxies `/api` and `/media` requests to Django backend
- CORS is enabled for all origins in development
- JWT tokens stored in localStorage on frontend
- QR codes are stored in `/backend/media/qr_codes/`
- SMS functionality requires Twilio credentials to be configured

## Running the Project
The project auto-starts via the configured workflow which runs:
```bash
cd backend && python manage.py runserver 0.0.0.0:8000 & cd frontend && npm run dev
```

- Frontend accessible at: http://localhost:5000
- Backend API at: http://localhost:8000/api/
- Admin panel at: http://localhost:8000/admin/

## Architectural Decisions
- **Custom User Model**: Extended Django's AbstractUser to include role field for role-based access control
- **QR Code Auto-Generation**: QR codes are automatically generated when a student is created
- **SMS Integration**: Centralized SMS utility functions in `utils/sms.py` for reusability
- **JWT Authentication**: Token-based auth for stateless API communication
- **Role-Based Routing**: Frontend routes protected based on user role (owner/teacher)
- **Proxy Configuration**: Vite proxies API calls to avoid CORS issues in development
