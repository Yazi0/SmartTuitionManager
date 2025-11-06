import { useState, useEffect } from 'react'
import { BarChart3, Calendar, DollarSign, Users } from 'lucide-react'
import api from '../utils/api'

function Reports() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    monthlyIncome: 0,
    todayAttendance: 0,
    outstandingPayments: 0,
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchStats()
  }, [])
  
  const fetchStats = async () => {
    try {
      const [students, teachers, classes, payments, attendance] = await Promise.all([
        api.get('/students/'),
        api.get('/accounts/teachers/'),
        api.get('/classes/'),
        api.get('/payments/'),
        api.get('/attendance/daily-report/')
      ])
      
      const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' }).toLowerCase()
      const currentYear = new Date().getFullYear()
      
      const monthlyIncome = payments.data
        .filter(p => p.status === 'paid' && p.month === currentMonth && p.year === currentYear)
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      
      const outstanding = payments.data
        .filter(p => p.status === 'pending' || p.status === 'overdue')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      
      setStats({
        totalStudents: students.data.length,
        totalTeachers: teachers.data.length,
        totalClasses: classes.data.length,
        monthlyIncome: monthlyIncome,
        todayAttendance: attendance.data.total_students || 0,
        outstandingPayments: outstanding,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div className="p-8">Loading...</div>
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Overview of tuition center performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <Users className="text-blue-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
            </div>
            <Users className="text-green-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
            </div>
            <BarChart3 className="text-purple-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Attendance</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayAttendance}</p>
            </div>
            <Calendar className="text-indigo-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
              <p className="text-3xl font-bold text-gray-900">${stats.monthlyIncome.toFixed(2)}</p>
            </div>
            <DollarSign className="text-green-600" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Outstanding Payments</p>
              <p className="text-3xl font-bold text-gray-900">${stats.outstandingPayments.toFixed(2)}</p>
            </div>
            <DollarSign className="text-red-500" size={40} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Students per Class Average</span>
              <span className="font-semibold">
                {stats.totalClasses > 0 ? (stats.totalStudents / stats.totalClasses).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Attendance Rate (Today)</span>
              <span className="font-semibold">
                {stats.totalStudents > 0 ? ((stats.todayAttendance / stats.totalStudents) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Classes per Teacher</span>
              <span className="font-semibold">
                {stats.totalTeachers > 0 ? (stats.totalClasses / stats.totalTeachers).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">All systems operational</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">SMS notifications active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">QR code generation working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
