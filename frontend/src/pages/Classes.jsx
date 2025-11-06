import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Button from '../components/Button'
import api from '../utils/api'

function Classes() {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    teacher: '',
    fee_per_month: '',
    schedule: '',
  })
  
  useEffect(() => {
    fetchClasses()
    fetchTeachers()
  }, [])
  
  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/')
      setClasses(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching classes:', error)
      setLoading(false)
    }
  }
  
  const fetchTeachers = async () => {
    try {
      const response = await api.get('/auth/teachers/')
      setTeachers(response.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedClass) {
        await api.put(`/classes/${selectedClass.id}/`, formData)
      } else {
        await api.post('/classes/', formData)
      }
      fetchClasses()
      closeModal()
    } catch (error) {
      console.error('Error saving class:', error)
      alert('Error saving class. Please check all fields.')
    }
  }
  
  const handleEdit = (cls) => {
    setSelectedClass(cls)
    setFormData({
      name: cls.name,
      subject: cls.subject,
      teacher: cls.teacher?.id || '',
      fee_per_month: cls.fee_per_month,
      schedule: cls.schedule,
    })
    setIsModalOpen(true)
  }
  
  const handleDelete = async (cls) => {
    if (window.confirm(`Are you sure you want to delete ${cls.name}?`)) {
      try {
        await api.delete(`/classes/${cls.id}/`)
        fetchClasses()
      } catch (error) {
        console.error('Error deleting class:', error)
        alert('Error deleting class')
      }
    }
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedClass(null)
    setFormData({
      name: '',
      subject: '',
      teacher: '',
      fee_per_month: '',
      schedule: '',
    })
  }
  
  const columns = [
    { header: 'Class Name', accessor: 'name' },
    { header: 'Subject', accessor: 'subject' },
    { 
      header: 'Teacher', 
      render: (row) => row.teacher ? `${row.teacher.first_name} ${row.teacher.last_name}` : 'Not Assigned'
    },
    { 
      header: 'Fee/Month', 
      render: (row) => `$${row.fee_per_month}`
    },
    { header: 'Schedule', accessor: 'schedule' },
    { 
      header: 'Students', 
      render: (row) => row.students?.length || 0
    },
  ]
  
  if (loading) {
    return <div className="p-8">Loading...</div>
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage class schedules and assignments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="inline mr-2" />
          Add Class
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No classes found. Create your first class to get started."
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedClass ? 'Edit Class' : 'Add New Class'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Grade 5 Mathematics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Mathematics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Teacher
            </label>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee per Month *
            </label>
            <input
              type="number"
              name="fee_per_month"
              value={formData.fee_per_month}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              step="0.01"
              placeholder="50.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule *
            </label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Mon/Wed/Fri 4-6 PM"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedClass ? 'Update Class' : 'Add Class'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Classes
