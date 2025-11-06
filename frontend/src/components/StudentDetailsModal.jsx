import { X, User, Phone, Mail, MapPin, Calendar, GraduationCap, CheckCircle } from 'lucide-react'

function StudentDetailsModal({ student, attendance, onClose }) {
  if (!student) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.full_name}</h2>
              <p className="text-blue-100">Student ID: {student.id}</p>
            </div>
          </div>
        </div>

        {/* Attendance Success Message */}
        {attendance && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={24} />
              <div>
                <h3 className="font-semibold text-green-900">Attendance Marked Successfully!</h3>
                <p className="text-sm text-green-700">
                  {formatDate(attendance.date)} at {new Date(attendance.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Student Details */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-semibold text-gray-900">{student.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-semibold text-gray-900">{student.username || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-semibold text-gray-900">{formatDate(student.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrollment Date</p>
                <p className="font-semibold text-gray-900">{formatDate(student.enrollment_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${student.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Class Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="mr-2" size={20} />
              Class Information
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Assigned Class</p>
              <p className="text-xl font-bold text-blue-900">
                {student.class_name || 'Not Assigned'}
              </p>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="mr-2" size={20} />
              Parent/Guardian Contact
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <User className="text-gray-400 mr-3" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Parent Name</p>
                  <p className="font-semibold text-gray-900">{student.parent_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="text-gray-400 mr-3" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{student.parent_phone}</p>
                </div>
              </div>
              {student.parent_email && (
                <div className="flex items-center">
                  <Mail className="text-gray-400 mr-3" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{student.parent_email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <MapPin className="text-gray-400 mr-3 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{student.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          {student.qr_code_url && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student QR Code</h3>
              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                <img 
                  src={student.qr_code_url} 
                  alt="Student QR Code" 
                  className="w-48 h-48 border-2 border-gray-300 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsModal
