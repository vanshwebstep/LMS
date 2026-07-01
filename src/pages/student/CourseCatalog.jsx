import { Link } from 'react-router-dom'
import { Clock, Star, Users } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Fullstack Web Development Bootcamp',
    coach: 'Alex Mercer',
    category: 'Coding',
    price: '$99',
    students: 1240,
    hours: 24,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Advanced Fitness and Nutrition Masterclass',
    coach: 'Sarah Connor',
    category: 'Health',
    price: '$49/mo',
    students: 820,
    hours: 14,
    rating: 4.7,
  },
  {
    id: 3,
    title: 'High-Ticket Sales Frameworks',
    coach: 'Jordan Blake',
    category: 'Business',
    price: '$199',
    students: 540,
    hours: 18,
    rating: 4.9,
  },
]

const CourseCatalog = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Available Courses</h2>
      <p className="mt-1 text-sm text-slate-500">Browse frontend-ready course cards for the LMS flow.</p>
    </div>

    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {courses.map((course) => (
        <article key={course.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="flex h-36 items-center justify-center bg-slate-900 px-6 text-center">
            <h3 className="text-xl font-bold text-white">{course.category}</h3>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                {course.category}
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">{course.title}</h3>
              <p className="mt-1 text-sm text-slate-500">By {course.coach}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Users size={14} /> {course.students}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {course.hours}h</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> {course.rating}</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-lg font-extrabold text-indigo-600">{course.price}</span>
              <Link
                to={`/student/courses/${course.id}`}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View Syllabus
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
)

export default CourseCatalog
