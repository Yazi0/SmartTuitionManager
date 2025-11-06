import { useState, useEffect } from 'react'
import { Calendar, Users, BookOpen, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

function TeacherHome() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalClasses: 0,
    todayAttendance: 0,
    totalStudents: 0,
  })
  const [classes, setClasses] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchTeacherData()
  }, [])
  
  const fetchTeacherData = async () => {
    try {
      const attendanceRes = await api.get('/attendance/daily-report/')
      
      let classesRes = { data: [] }
      let studentsRes = { data: [] }
      
      try {
        classesRes = await api.get('/classes/')
      } catch (err) {
        console.log('Unable to fetch classes')
      }
      
      try {
        studentsRes = await api.get('/students/')
      } catch (err) {
        console.log('Unable to fetch students')
      }
      
      setClasses(classesRes.data)
      setRecentAttendance(attendanceRes.data.recent_records || [])
      
      setStats({
        totalClasses: classesRes.data.length,
        todayAttendance: attendanceRes.data.total_students || 0,
        totalStudents: studentsRes.data.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching teacher data:', error)
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.username}!</h1>
        <p className="text-gray-600 mt-1">Teacher Dashboard - Track your classes and student attendance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Classes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
            </div>
            <BookOpen className="text-blue-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Attendance</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayAttendance}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <Users className="text-purple-500" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} />
            My Classes
          </h2>
          
          {classes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No classes assigned yet</p>
          ) : (
            <div className="space-y-3">
              {classes.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{cls.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {cls.schedule} • {cls.start_time} - {cls.end_time}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {cls.students_count || 0} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-green-600" size={24} />
            Recent Attendance
          </h2>
          
          {recentAttendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records yet</p>
          ) : (
            <div className="space-y-3">
              {recentAttendance.slice(0, 5).map((record, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{record.student_name}</p>
                      <p className="text-sm text-gray-600">{record.class_name || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        {record.time_in}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• View detailed attendance records in the Attendance section</li>
          <li>• Check class schedules and student lists in your assigned classes</li>
          <li>• Contact the owner for any administrative changes</li>
        </ul>
      </div>
    </div>
  )
}

export default TeacherHome
