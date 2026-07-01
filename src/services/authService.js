import { LOCAL_KEYS, ROLES } from '../utils/constants'
import { storage } from '../utils/storage'

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

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const cleanEmail = (email = '') => email.trim().toLowerCase()

const toPublicUser = (account) => {
  const user = { ...account }
  delete user.password
  return user
}

const makeToken = (prefix, seed) => `${prefix}-${seed}-${Date.now()}`

const getAccounts = () => {
  const existing = storage.get(LOCAL_KEYS.MOCK_ACCOUNTS)
  if (Array.isArray(existing) && existing.length) return existing

  storage.set(LOCAL_KEYS.MOCK_ACCOUNTS, DEMO_ACCOUNTS)
  return DEMO_ACCOUNTS
}

const saveAccounts = (accounts) => storage.set(LOCAL_KEYS.MOCK_ACCOUNTS, accounts)

const findAccount = (email) =>
  getAccounts().find((account) => account.email === cleanEmail(email))

const createSession = (account) => ({
  user: toPublicUser(account),
  accessToken: makeToken('mock-access', account.id),
  refreshToken: makeToken('mock-refresh', account.id),
})

const authService = {
  getDemoAccounts: () => DEMO_ACCOUNTS.map(toPublicUser),

  login: async ({ email, password }) => {
    await wait()

    const normalizedEmail = cleanEmail(email)
    const account = findAccount(normalizedEmail)

    if (!account) {
      throw new Error('No local account found for this email')
    }

    if (account.password !== password) {
      throw new Error('Password is incorrect')
    }

    return createSession(account)
  },

  register: async (data) => {
    await wait()

    const normalizedEmail = cleanEmail(data.email)
    const accounts = getAccounts()

    if (accounts.some((account) => account.email === normalizedEmail)) {
      throw new Error('This email is already registered locally')
    }

    const account = {
      id: `local-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      role: data.role || ROLES.STUDENT,
      title: data.role === ROLES.COACH ? 'Course Coach' : 'Learner',
    }

    saveAccounts([...accounts, account])
    return createSession(account)
  },

  logout: async () => {
    await wait(100)
    return { success: true }
  },

  forgotPassword: async (email) => {
    await wait()

    const account = findAccount(email)
    if (!account) throw new Error('No local account found for this email')

    const resetToken = makeToken('reset', account.id)
    storage.set(LOCAL_KEYS.RESET_TOKEN, {
      token: resetToken,
      email: account.email,
      createdAt: Date.now(),
    })

    return { resetToken }
  },

  resetPassword: async (token, password) => {
    await wait()

    const reset = storage.get(LOCAL_KEYS.RESET_TOKEN)
    if (!reset || reset.token !== token) {
      throw new Error('Reset link is invalid or expired')
    }

    const accounts = getAccounts().map((account) =>
      account.email === reset.email ? { ...account, password } : account
    )

    saveAccounts(accounts)
    storage.remove(LOCAL_KEYS.RESET_TOKEN)

    return { success: true }
  },

  verifyEmail: async () => {
    await wait()
    return { success: true }
  },

  getMe: async () => {
    await wait(100)
    const user = storage.get(LOCAL_KEYS.USER)
    if (!user) throw new Error('No active local session')
    return { user }
  },

  refreshToken: async () => {
    await wait(100)
    const user = storage.get(LOCAL_KEYS.USER)
    if (!user) throw new Error('No active local session')
    return { accessToken: makeToken('mock-access', user.id) }
  },
}

export default authService

