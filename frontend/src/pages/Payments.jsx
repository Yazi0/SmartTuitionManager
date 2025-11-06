import { useState, useEffect } from 'react'
import { Plus, DollarSign } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Button from '../components/Button'
import api from '../utils/api'

function Payments() {
  const [payments, setPayments] = useState([])
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [formData, setFormData] = useState({
    student: '',
    class_fee: '',
    month: '',
    year: new Date().getFullYear(),
    amount: '',
    status: 'pending',
    payment_date: '',
  })
  
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ]
  
  useEffect(() => {
    fetchPayments()
    fetchStudents()
    fetchClasses()
  }, [])
  
  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/')
      setPayments(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setLoading(false)
    }
  }
  
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students/')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
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
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      if (name === 'class_fee' && value) {
        const selectedClass = classes.find(c => c.id === parseInt(value))
        if (selectedClass) {
          newData.amount = selectedClass.fee_per_month
        }
      }
      
      return newData
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedPayment) {
        await api.put(`/payments/${selectedPayment.id}/`, formData)
      } else {
        await api.post('/payments/', formData)
      }
      fetchPayments()
      closeModal()
    } catch (error) {
      console.error('Error saving payment:', error)
      alert('Error saving payment. Please check all fields.')
    }
  }
  
  const handleEdit = (payment) => {
    setSelectedPayment(payment)
    setFormData({
      student: payment.student.id,
      class_fee: payment.class_fee.id,
      month: payment.month,
      year: payment.year,
      amount: payment.amount,
      status: payment.status,
      payment_date: payment.payment_date || '',
    })
    setIsModalOpen(true)
  }
  
  const handleDelete = async (payment) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await api.delete(`/payments/${payment.id}/`)
        fetchPayments()
      } catch (error) {
        console.error('Error deleting payment:', error)
        alert('Error deleting payment')
      }
    }
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPayment(null)
    setFormData({
      student: '',
      class_fee: '',
      month: '',
      year: new Date().getFullYear(),
      amount: '',
      status: 'pending',
      payment_date: '',
    })
  }
  
  const getStatusBadge = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }
  
  const columns = [
    { 
      header: 'Student', 
      render: (row) => row.student.full_name
    },
    { 
      header: 'Class', 
      render: (row) => `${row.class_fee.name} - ${row.class_fee.subject}`
    },
    { 
      header: 'Period', 
      render: (row) => `${row.month.charAt(0).toUpperCase() + row.month.slice(1)} ${row.year}`
    },
    { 
      header: 'Amount', 
      render: (row) => `$${row.amount}`
    },
    { 
      header: 'Status', 
      render: (row) => getStatusBadge(row.status)
    },
    { 
      header: 'Payment Date', 
      render: (row) => row.payment_date || '-'
    },
    { 
      header: 'SMS Sent', 
      render: (row) => row.sms_sent ? '✓' : '-'
    },
  ]
  
  if (loading) {
    return <div className="p-8">Loading...</div>
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Track student fee payments and billing</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="inline mr-2" />
          Add Payment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-600" size={32} />
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-700">
                ${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <DollarSign className="text-yellow-600" size={32} />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">
                ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <DollarSign className="text-red-600" size={32} />
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-700">
                ${payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={payments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No payment records found."
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedPayment ? 'Edit Payment' : 'Add New Payment'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student *
            </label>
            <select
              name="student"
              value={formData.student}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <select
              name="class_fee"
              value={formData.class_fee}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - ${cls.fee_per_month}/month
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          {formData.status === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedPayment ? 'Update Payment' : 'Add Payment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Payments
