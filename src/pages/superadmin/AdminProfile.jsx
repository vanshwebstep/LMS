import { Mail, Save, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminProfile = () => {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Manage the local frontend admin identity.</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-2xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Admin User'}</h3>
            <p className="text-sm text-slate-500">{user?.email || 'admin@learnflow.local'}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
              <ShieldCheck size={14} /> Super Admin
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700"><UserRound size={15} /> Full Name</span>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" value={user?.name || 'Admin User'} readOnly />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700"><Mail size={15} /> Email</span>
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" value={user?.email || 'admin@learnflow.local'} readOnly />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
