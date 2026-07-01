import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, PlayCircle, Star, Users } from 'lucide-react'

const modules = [
  'HTML and CSS foundations',
  'JavaScript mastery',
  'React components and routing',
  'Node.js backend basics',
]

const CourseDetail = () => {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <Link to="/student/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
        <ArrowLeft size={16} /> Back to courses
      </Link>

      <section className="grid gap-5 rounded-lg bg-slate-900 p-6 text-white lg:grid-cols-[1fr_320px]">
        <div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">Coding</span>
          <h1 className="mt-4 text-3xl font-extrabold text-white">Fullstack Web Development Bootcamp</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Mock course #{id} covers React, Node.js, routing, APIs, and project structure for a complete LMS preview.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="flex items-center gap-2"><Users size={16} /> 1,240 students</span>
            <span className="flex items-center gap-2"><Clock size={16} /> 24 hours</span>
            <span className="flex items-center gap-2"><Star size={16} className="text-amber-400" /> 4.8 rating</span>
          </div>
        </div>

        <aside className="rounded-lg bg-white p-5 text-slate-900">
          <p className="text-sm font-semibold text-slate-500">Lifetime access</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">$99.00</p>
          <Link
            to="/student/checkout/1"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <PlayCircle size={18} /> Enroll Now
          </Link>
          <div className="mt-5 space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600" /> 24 hours of video</p>
            <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600" /> 5 projects</p>
            <p className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600" /> Certificate included</p>
          </div>
        </aside>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Course Syllabus</h2>
        <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
          {modules.map((module, index) => (
            <div key={module} className="flex items-center justify-between gap-4 p-4">
              <div>
                <h3 className="font-semibold text-slate-900">Module {index + 1}: {module}</h3>
                <p className="mt-1 text-sm text-slate-500">4 lessons, 2 quizzes</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                Preview
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CourseDetail
