import { useState, useEffect } from 'react'
import { Plus, Download, QrCode } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Button from '../components/Button'
import api from '../utils/api'

function Students() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    full_name: '',
    date_of_birth: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    address: '',
    assigned_class: '',
  })
  
  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])
  
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students/')
      setStudents(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching students:', error)
      setLoading(false)
    }
  }
  
  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/')
      setClasses(response.data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedStudent) {
        await api.put(`/students/${selectedStudent.id}/`, formData)
      } else {
        await api.post('/students/', formData)
      }
      fetchStudents()
      closeModal()
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Error saving student. Please check all fields.')
    }
  }
  
  const handleEdit = (student) => {
    setSelectedStudent(student)
    setFormData({
      username: student.user.username,
      password: '',
      first_name: student.user.first_name,
      full_name: student.full_name,
      date_of_birth: student.date_of_birth,
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
      parent_email: student.parent_email || '',
      address: student.address,
      assigned_class: student.assigned_class?.id || '',
    })
    setIsModalOpen(true)
  }
  
  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.full_name}?`)) {
      try {
        await api.delete(`/students/${student.id}/`)
        fetchStudents()
      } catch (error) {
        console.error('Error deleting student:', error)
        alert('Error deleting student')
      }
    }
  }
  
  const handleViewQR = (student) => {
    setSelectedStudent(student)
    setIsQRModalOpen(true)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedStudent(null)
    setFormData({
      username: '',
      password: '',
      first_name: '',
      full_name: '',
      date_of_birth: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      address: '',
      assigned_class: '',
    })
  }
  
  const columns = [
    { header: 'Student Name', accessor: 'full_name' },
    { 
      header: 'Class', 
      render: (row) => row.assigned_class?.name || 'Not Assigned' 
    },
    { header: 'Parent Name', accessor: 'parent_name' },
    { header: 'Parent Phone', accessor: 'parent_phone' },
    { 
      header: 'Status', 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ]
  
  if (loading) {
    return <div className="p-8">Loading...</div>
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student registrations and information</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="inline mr-2" />
          Add Student
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewQR}
        emptyMessage="No students found. Add your first student to get started."
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={selectedStudent}
              />
            </div>
            
            {!selectedStudent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Class
              </label>
              <select
                name="assigned_class"
                value={formData.assigned_class}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Name *
              </label>
              <input
                type="text"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone *
              </label>
              <input
                type="tel"
                name="parent_phone"
                value={formData.parent_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Email
              </label>
              <input
                type="email"
                name="parent_email"
                value={formData.parent_email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedStudent ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>
      
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title="Student QR Code"
        size="sm"
      >
        {selectedStudent && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">{selectedStudent.full_name}</h3>
            {selectedStudent.qr_code ? (
              <div>
                <img 
                  src={`http://localhost:8000${selectedStudent.qr_code}`}
                  alt="Student QR Code"
                  className="mx-auto mb-4 border-2 border-gray-300 rounded p-4"
                />
                <a
                  href={`http://localhost:8000${selectedStudent.qr_code}`}
                  download={`${selectedStudent.full_name}_QR.png`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Download size={18} />
                  Download QR Code
                </a>
              </div>
            ) : (
              <p className="text-gray-500">QR Code not available</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Students
