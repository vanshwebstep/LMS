import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getRoleRedirect } from '../../utils/helpers'
import { ROLES } from '../../utils/constants'
import { DEMO_ACCOUNTS } from '../../services/authService'
import toast from 'react-hot-toast'
import './auth.css'

const ROLE_META = {
  [ROLES.SUPER_ADMIN]: { label: 'Admin', Icon: ShieldCheck },
  [ROLES.COACH]: { label: 'Coach', Icon: Trophy },
  [ROLES.STUDENT]: { label: 'Student', Icon: GraduationCap },
}

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const finishLogin = async (credentials) => {
    const user = await login(credentials)
    toast.success(`Welcome back, ${user.name}!`)
    navigate(from || getRoleRedirect(user.role), { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      await finishLogin(form)
    } catch (err) {
      toast.error(err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (account) => {
    setLoading(true)
    setForm({ email: account.email, password: account.password })

    try {
      await finishLogin({ email: account.email, password: account.password })
    } catch (err) {
      toast.error(err?.message || 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card animate-slideUp">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <ShieldCheck size={25} />
        </div>
        <span className="auth-logo-text">LearnFlow</span>
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to continue your workspace</p>

      <div className="demo-grid" aria-label="Demo accounts">
        {DEMO_ACCOUNTS.map((account) => {
          const meta = ROLE_META[account.role]
          const Icon = meta.Icon

          return (
            <button
              key={account.id}
              type="button"
              className="demo-button"
              onClick={() => handleDemoLogin(account)}
              disabled={loading}
            >
              <Icon size={17} />
              <span>{meta.label}</span>
            </button>
          )
        })}
      </div>

      <div className="auth-divider"><span>or</span></div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={16} />
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label className="form-label" htmlFor="login-password">Password</label>
            <Link to="/forgot-password" className="form-link">
              Forgot password?
            </Link>
          </div>

          <div className="input-wrapper">
            <Lock className="input-icon" size={16} />
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <button
              type="button"
              className="input-toggle"
              onClick={() => setShowPass((p) => !p)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="btn-spinner" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="auth-footer-text">
        Do not have an account?{' '}
        <Link to="/register" className="form-link">
          Create account
        </Link>
      </p>
    </div>
  )
}

export default Login
