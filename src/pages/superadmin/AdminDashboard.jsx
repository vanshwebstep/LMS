import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, BookOpen, CreditCard, ShieldCheck, TrendingUp, Users } from 'lucide-react'

const metrics = [
  { label: 'Active Coaches', value: '24', delta: '+4 this month', icon: Users, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  { label: 'Students', value: '1,420', delta: '+18.2%', icon: ShieldCheck, tone: 'bg-sky-50 text-sky-700 ring-sky-100' },
  { label: 'Published Courses', value: '86', delta: '12 in review', icon: BookOpen, tone: 'bg-violet-50 text-violet-700 ring-violet-100' },
  { label: 'Revenue', value: 'Rs 4.8L', delta: '+Rs 62k', icon: CreditCard, tone: 'bg-amber-50 text-amber-700 ring-amber-100' },
]

const coachRows = [
  { name: 'Meera Coach', segment: 'Web Development', courses: 8, students: 142, status: 'Active' },
  { name: 'Alex Mercer', segment: 'Backend', courses: 5, students: 96, status: 'Active' },
  { name: 'Sarah Connor', segment: 'Health', courses: 4, students: 84, status: 'Review' },
]

const courseRows = [
  { title: 'React Masterclass', coach: 'Meera Coach', revenue: 'Rs 22,500', status: 'Published' },
  { title: 'Node.js Basics', coach: 'Alex Mercer', revenue: 'Rs 16,000', status: 'Published' },
  { title: 'CSS Advanced', coach: 'Sarah Connor', revenue: 'Rs 9,000', status: 'Draft' },
]

const StatusPill = ({ children, active }) => (
  <span className={`rounded-md px-2 py-1 text-xs font-black ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
    {children}
  </span>
)

export default function AdminDashboard() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-5 bg-[#111827] p-6 text-white lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Platform Command</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Revenue, quality, and growth at a glance.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor coach performance, student acquisition, pending reviews, and payment movement from a single clean control center.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">Monthly run-rate</span>
              <TrendingUp size={18} className="text-emerald-300" />
            </div>
            <p className="mt-4 text-4xl font-black text-white">Rs 5.4L</p>
            <p className="mt-1 text-sm text-emerald-200">Projected from current enrollments</p>
            <Link to="/admin/reports" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-black text-slate-950 hover:bg-slate-100">
              Open reports <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, delta, icon: Icon, tone }) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ring-1 ${tone}`}><Icon size={22} /></div>
            </div>
            <p className="mt-4 text-xs font-bold text-slate-500">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">Revenue Momentum</h3>
              <p className="text-sm text-slate-500">Last 12 weeks</p>
            </div>
            <BarChart3 className="text-slate-400" size={20} />
          </div>
          <div className="flex h-52 items-end gap-2">
            {[38, 52, 46, 72, 64, 88, 58, 70, 84, 92, 61, 78].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-slate-900 transition hover:bg-emerald-500" style={{ height: `${height}%` }} />
                <span className="text-[10px] font-bold text-slate-400">W{index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-950">Coach Activity</h3>
              <p className="text-sm text-slate-500">Top active creators</p>
            </div>
            <Link to="/admin/coaches" className="inline-flex items-center gap-1 text-sm font-black text-emerald-700 hover:text-emerald-800">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {coachRows.map((coach) => (
              <div key={coach.name} className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <p className="font-black text-slate-950">{coach.name}</p>
                  <p className="text-sm text-slate-500">{coach.segment} - {coach.courses} courses - {coach.students} students</p>
                </div>
                <StatusPill active={coach.status === 'Active'}>{coach.status}</StatusPill>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-950">Course Pipeline</h3>
            <p className="text-sm text-slate-500">Recent catalog changes</p>
          </div>
          <Link to="/admin/courses" className="inline-flex items-center gap-1 text-sm font-black text-emerald-700 hover:text-emerald-800">
            Manage <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Course</th><th className="px-4 py-3">Coach</th><th className="px-4 py-3">Revenue</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseRows.map((course) => (
                <tr key={course.title} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-black text-slate-950">{course.title}</td>
                  <td className="px-4 py-3 text-slate-600">{course.coach}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{course.revenue}</td>
                  <td className="px-4 py-3"><StatusPill active={course.status === 'Published'}>{course.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
