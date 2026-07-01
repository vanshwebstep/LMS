import { Link } from 'react-router-dom'
import { Award, BookOpen, Clock, PlayCircle, Target, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const courses = [
  { id: 1, title: 'Fullstack Web Development Bootcamp', coach: 'Alex Mercer', progress: 45, nextLesson: 'React Router and layouts', tone: 'bg-sky-500' },
  { id: 2, title: 'Advanced Fitness and Nutrition', coach: 'Sarah Connor', progress: 68, nextLesson: 'Weekly meal planning', tone: 'bg-emerald-500' },
]

const metrics = [
  { label: 'Active Courses', value: '2', icon: BookOpen, tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
  { label: 'Hours Learned', value: '18.5', icon: Clock, tone: 'bg-violet-50 text-violet-700 ring-violet-100' },
  { label: 'Avg Progress', value: '57%', icon: TrendingUp, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  { label: 'Certificates', value: '1', icon: Award, tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
]

const agenda = [
  { title: 'Complete React Router module', time: 'Today, 35 min' },
  { title: 'Submit project wireframe', time: 'Tomorrow' },
  { title: 'Nutrition quiz attempt', time: 'Friday' },
]

const StudentDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-5 bg-[#101828] p-6 text-white lg:grid-cols-[1fr_340px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">Student Hub</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Welcome back, {user?.name || 'Student'}.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Pick up your active courses, keep progress steady, and track upcoming tasks from one focused learning workspace.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/student/courses" className="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-sky-300">
                <BookOpen size={17} /> Browse Courses
              </Link>
              <Link to="/student/my-learning" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-black text-white hover:bg-white/10">
                Continue Learning <PlayCircle size={17} />
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-sm font-bold">Weekly goal</span>
              <Target size={18} className="text-sky-300" />
            </div>
            <p className="mt-4 text-5xl font-black text-white">7.5h</p>
            <p className="mt-1 text-sm text-sky-100">of 10 hours completed</p>
            <div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-sky-400" /></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></div>
              <div className={`rounded-lg p-3 ring-1 ${tone}`}><Icon size={22} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-black text-slate-950">My Active Courses</h3><p className="text-sm text-slate-500">Continue from where you stopped</p></div>
            <Link to="/student/courses" className="text-sm font-black text-sky-700 hover:text-sky-800">Explore</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {courses.map((course) => (
              <article key={course.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><h4 className="font-black text-slate-950">{course.title}</h4><p className="mt-1 text-sm text-slate-500">By {course.coach}</p></div>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-slate-700 shadow-sm">{course.progress}%</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white"><div className={`h-full rounded-full ${course.tone}`} style={{ width: `${course.progress}%` }} /></div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">Next: {course.nextLesson}</p>
                  <Link to={`/student/courses/${course.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-black text-white hover:bg-slate-800">
                    Continue <PlayCircle size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4"><h3 className="font-black text-slate-950">Study Agenda</h3><p className="text-sm text-slate-500">Upcoming tasks</p></div>
          <div className="space-y-3">
            {agenda.map((item, index) => (
              <div key={item.title} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white">{index + 1}</div>
                <div><p className="text-sm font-black text-slate-950">{item.title}</p><p className="text-xs font-semibold text-slate-500">{item.time}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default StudentDashboard
