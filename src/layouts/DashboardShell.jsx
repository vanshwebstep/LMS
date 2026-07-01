import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const accentClasses = {
  admin: {
    chip: 'bg-emerald-500/10 text-emerald-200 ring-emerald-400/20',
    active: 'bg-emerald-500/15 text-white ring-1 ring-emerald-400/25',
    icon: 'bg-emerald-400 text-slate-950',
  },
  coach: {
    chip: 'bg-amber-500/10 text-amber-200 ring-amber-400/20',
    active: 'bg-amber-500/15 text-white ring-1 ring-amber-400/25',
    icon: 'bg-amber-400 text-slate-950',
  },
  student: {
    chip: 'bg-sky-500/10 text-sky-200 ring-sky-400/20',
    active: 'bg-sky-500/15 text-white ring-1 ring-sky-400/25',
    icon: 'bg-sky-400 text-slate-950',
  },
}

export default function DashboardShell({
  navItems,
  label,
  title,
  subtitle,
  accent = 'admin',
  profilePath,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const palette = accentClasses[accent] || accentClasses.admin

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex bg-[#f5f7fb] text-slate-950">
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-24'
        } flex shrink-0 flex-col border-r border-white/10 bg-[#111827] text-slate-300 transition-all duration-300`}
      >
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${palette.icon}`}>
              <ShieldCheck size={21} />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-base font-black tracking-tight text-white">LearnFlow</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${palette.chip}`}>
                  {label}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ path, label: navLabel, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? palette.active
                    : 'text-slate-400 hover:bg-white/8 hover:text-white'
                }`
              }
              title={!sidebarOpen ? navLabel : undefined}
            >
              <Icon size={19} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{navLabel}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/10 hover:text-white"
          >
            <LogOut size={19} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200/80 bg-white/90 px-5 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-slate-950">{title}</h1>
              <p className="truncate text-xs font-medium text-slate-500">{subtitle}</p>
            </div>

            <div className="hidden min-w-[280px] max-w-sm flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 lg:flex">
              <Search size={16} />
              <span>Search courses, users, reports...</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden text-sm font-bold text-slate-700 sm:inline">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown size={15} className="text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                    {profilePath && (
                      <NavLink
                        to={profilePath}
                        className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </NavLink>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
