import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Button from '../components/Button'
import api from '../utils/api'

function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })
  
  useEffect(() => {
    fetchTeachers()
  }, [])
  
  const fetchTeachers = async () => {
    try {
      const response = await api.get('/auth/teachers/')
      setTeachers(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching teachers:', error)
      setLoading(false)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedTeacher) {
        await api.put(`/auth/teachers/${selectedTeacher.id}/`, formData)
      } else {
        await api.post('/auth/teachers/create/', formData)
      }
      fetchTeachers()
      closeModal()
    } catch (error) {
      console.error('Error saving teacher:', error)
      alert('Error saving teacher. Please check all fields.')
    }
  }
  
  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher)
    setFormData({
      username: teacher.username,
      password: '',
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      phone: teacher.phone,
    })
    setIsModalOpen(true)
  }
  
  const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.first_name} ${teacher.last_name}?`)) {
      try {
        await api.delete(`/auth/teachers/${teacher.id}/`)
        fetchTeachers()
      } catch (error) {
        console.error('Error deleting teacher:', error)
        alert('Error deleting teacher')
      }
    }
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTeacher(null)
    setFormData({
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    })
  }
  
  const columns = [
    { 
      header: 'Name', 
      render: (row) => `${row.first_name} ${row.last_name}` 
    },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Classes Assigned', 
      render: (row) => row.classes_taught?.length || 0
    },
  ]
  
  if (loading) {
    return <div className="p-8">Loading...</div>
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage teacher accounts and assignments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="inline mr-2" />
          Add Teacher
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={teachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No teachers found. Add your first teacher to get started."
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
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
              />
            </div>
            
            {!selectedTeacher && (
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
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedTeacher ? 'Update Teacher' : 'Add Teacher'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Teachers
