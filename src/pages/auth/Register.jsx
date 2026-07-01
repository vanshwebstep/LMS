import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck, Trophy, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'
import { getRoleRedirect } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './auth.css'

const ROLE_OPTIONS = [
  {
    value: ROLES.STUDENT,
    label: 'Student / Learner',
    Icon: GraduationCap,
    desc: 'Browse and enroll in courses',
  },
  {
    value: ROLES.COACH,
    label: 'Coach / Trainer',
    Icon: Trophy,
    desc: 'Create and sell courses',
  },
]

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.STUDENT,
  })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleNext = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Please fill all fields')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.password) return toast.error('Enter a password')
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }

    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Account created, ${user.name}!`)
      navigate(getRoleRedirect(user.role), { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Registration failed')
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

      <div className="auth-steps">
        <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="auth-step-line" />
        <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>2</div>
      </div>

      <h1 className="auth-title">
        {step === 1 ? 'Create account' : 'Choose your role'}
      </h1>
      <p className="auth-subtitle">
        {step === 1
          ? 'Start with your profile details'
          : 'Your dashboard opens from this role'}
      </p>

      {step === 1 ? (
        <form onSubmit={handleNext} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={16} />
              <input
                id="register-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                id="register-email"
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

          <button type="submit" className="btn-primary">
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="role-selector">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.Icon
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`role-option ${form.role === opt.value ? 'selected' : ''}`}
                  onClick={() => setForm((p) => ({ ...p, role: opt.value }))}
                >
                  <span className="role-icon"><Icon size={20} /></span>
                  <span className="role-copy">
                    <span className="role-label">{opt.label}</span>
                    <span className="role-desc">{opt.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
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

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep(1)}
            >
              Back
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      )}

      <p className="auth-footer-text">
        Already have an account?{' '}
        <Link to="/login" className="form-link">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register
