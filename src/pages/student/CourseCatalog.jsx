import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Star, Users } from 'lucide-react'
import api from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

const CourseCatalog = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get('/student/courses/browse')
        if (alive) setCourses(res.courses || [])
      } catch (err) {
        if (alive) setError(err?.message || 'Courses load nahi ho paaye')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900">Available Courses</h2><p className="mt-1 text-sm text-slate-500">Browse live courses from coaches.</p></div>
      {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {loading ? <div className="rounded-lg bg-white p-10 text-center text-slate-500 shadow-sm">Loading courses...</div> : courses.length === 0 ? <div className="rounded-lg bg-white p-10 text-center text-slate-500 shadow-sm">No published courses available</div> : <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">{courses.map((course) => (<article key={course.id} className="overflow-hidden rounded-lg bg-white shadow-sm"><div className="flex h-36 items-center justify-center bg-slate-900 px-6 text-center"><h3 className="text-xl font-bold text-white">{course.category}</h3></div><div className="space-y-4 p-5"><div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">{course.category}</span><h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">{course.title}</h3><p className="mt-1 text-sm text-slate-500">By {course.coach?.name || 'Coach'}</p></div><div className="grid grid-cols-3 gap-2 text-xs text-slate-500"><span className="flex items-center gap-1"><Users size={14} /> {course.students || 0}</span><span className="flex items-center gap-1"><Clock size={14} /> {course.difficulty}</span><span className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> Live</span></div><div className="flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-lg font-extrabold text-indigo-600">{formatCurrency(course.price || 0, course.currency || 'INR')}</span><Link to={`/student/courses/${course.id}`} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">View Syllabus</Link></div></div></article>))}</div>}
    </div>
  )
}

export default CourseCatalog