import API_CONFIG from '../config/api.config'
import { ROLES } from '../utils/constants'
import { getRefreshToken } from '../utils/storage'
import api from './api'

const PASSWORD = 'password123'

export const DEMO_ACCOUNTS = [
  {
    id: 'admin-demo',
    name: 'Aarav Admin',
    email: 'admin@learnflow.local',
    password: PASSWORD,
    role: ROLES.SUPER_ADMIN,
    title: 'Platform Admin',
  },
  {
    id: 'coach-demo',
    name: 'Meera Coach',
    email: 'coach@learnflow.local',
    password: PASSWORD,
    role: ROLES.COACH,
    title: 'Course Coach',
  },
  {
    id: 'student-demo',
    name: 'Rohan Student',
    email: 'student@learnflow.local',
    password: PASSWORD,
    role: ROLES.STUDENT,
    title: 'Learner',
  },
]

const authService = {
  getDemoAccounts: () => DEMO_ACCOUNTS.map(({ id, name, email, role, title }) => ({ id, name, email, role, title })),

  login: (credentials) => api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),

  register: (data) => api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data),

  logout: () =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      refreshToken: getRefreshToken(),
    }),

  forgotPassword: (email) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token, password) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),

  verifyEmail: (token) =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),

  getMe: () => api.get(API_CONFIG.ENDPOINTS.AUTH.ME),

  refreshToken: () =>
    api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken: getRefreshToken(),
    }),

  changePassword: ({ oldPassword, newPassword }) =>
    api.post('/auth/change-password', { oldPassword, newPassword }),

  requestPasswordOtp: (email) =>
    api.post('/auth/request-password-otp', { email }),

  changePasswordWithOtp: ({ email, otp, newPassword }) =>
    api.post('/auth/change-password-with-otp', { email, otp, newPassword }),
}

export default authService