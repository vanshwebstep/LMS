import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ClipboardList, DollarSign, Eye, PlusCircle, TrendingUp, Users } from 'lucide-react'

const metrics = [
  { label: 'Courses Live', value: '8', delta: '3 drafts ready', icon: BookOpen, tone: 'bg-violet-50 text-violet-700 ring-violet-100' },
  { label: 'Students', value: '142', delta: '+17 this week', icon: Users, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  { label: 'Earnings', value: 'Rs 71,200', delta: '+12% MoM', icon: DollarSign, tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
  { label: 'Assignments', value: '12', delta: 'Need review', icon: ClipboardList, tone: 'bg-rose-50 text-rose-700 ring-rose-100' },
]

const recentStudents = [
  { name: 'Rahul Sharma', course: 'React Masterclass', progress: 75, date: '28 May' },
  { name: 'Priya Singh', course: 'Node.js Basics', progress: 40, date: '27 May' },
  { name: 'Amit Kumar', course: 'React Masterclass', progress: 90, date: '26 May' },
  { name: 'Neha Gupta', course: 'CSS Advanced', progress: 20, date: '25 May' },
]

const recentCourses = [
  { title: 'React Masterclass', students: 45, revenue: 'Rs 22,500', status: 'Active' },
  { title: 'Node.js Basics', students: 32, revenue: 'Rs 16,000', status: 'Active' },
  { title: 'CSS Advanced', students: 18, revenue: 'Rs 9,000', status: 'Draft' },
]

const statusClass = (status) =>
  status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'

export default function CoachDashboard() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-5 bg-[#15171f] p-6 text-white lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Coach Studio</p>
            
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Build, review, and scale your course business.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Your active learning products, student progress, assignment load, and revenue movement are organized for fast daily decisions.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/coach/create-course" className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-amber-300">
                <PlusCircle size={17} /> New Course
              </Link>
              <Link to="/coach/my-students" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-black text-white hover:bg-white/10">
                Review Students <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-sm font-bold">Completion health</span>
              <TrendingUp size={18} className="text-amber-300" />
            </div>
            <div className="mt-5 flex items-end gap-3">
              <p className="text-5xl font-black text-white">82%</p>
              <p className="pb-2 text-sm font-semibold text-emerald-200">students on track</p>
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/10">
              <div className="h-full w-[82%] rounded-full bg-amber-400" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, delta, icon: Icon, tone }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ring-1 ${tone}`}><Icon size={22} /></div>
            </div>
            <p className="mt-4 text-xs font-bold text-slate-500">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div><h3 className="font-black text-slate-950">Earnings Trend</h3><p className="text-sm text-slate-500">Last 12 weeks</p></div>
            <Link to="/coach/earnings" className="text-sm font-black text-amber-700 hover:text-amber-800">Details</Link>
          </div>
          <div className="flex h-48 items-end gap-2">
            {[40, 65, 50, 80, 70, 90, 60, 75, 85, 95, 55, 70].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-slate-900 transition hover:bg-amber-400" style={{ height: `${height}%` }} />
                <span className="text-[10px] font-bold text-slate-400">W{index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="font-black text-slate-950">Recent Students</h3><p className="text-sm text-slate-500">Learning activity snapshot</p></div>
            <Link to="/coach/my-students" className="inline-flex items-center gap-1 text-sm font-black text-amber-700 hover:text-amber-800">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="space-y-3">
            {recentStudents.map((student) => (
              <div key={student.name} className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{student.name}</p>
                    <p className="truncate text-sm text-slate-500">{student.course} - {student.date}</p>
                  </div>
                  <span className="text-sm font-black text-slate-700">{student.progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${student.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div><h3 className="font-black text-slate-950">Course Portfolio</h3><p className="text-sm text-slate-500">Top monetized courses</p></div>
          <Link to="/coach/my-courses" className="inline-flex items-center gap-1 text-sm font-black text-amber-700 hover:text-amber-800">Manage <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {recentCourses.map((course) => (
            <article key={course.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div><h4 className="font-black text-slate-950">{course.title}</h4><p className="mt-1 text-sm text-slate-500">{course.students} students</p></div>
                <Link to="/coach/course-detail/1" className="rounded-lg bg-white p-2 text-slate-600 shadow-sm hover:text-slate-950" aria-label="View course"><Eye size={16} /></Link>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="font-black text-slate-950">{course.revenue}</span>
                <span className={`rounded-md px-2 py-1 text-xs font-black ${statusClass(course.status)}`}>{course.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
