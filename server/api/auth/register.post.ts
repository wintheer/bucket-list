import { getUsersCollection } from '~/server/utils/db'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// No public sign-up page exists. Account creation is an admin-only action,
// gated by NUXT_SIGNUP_SECRET, invoked directly (e.g. via curl) rather than from the UI.
export default defineEventHandler(async (event) => {
  const { signupSecret } = useRuntimeConfig()
  const providedSecret = getHeader(event, 'x-signup-secret')
  if (!signupSecret || providedSecret !== signupSecret) {
    throw createError({ statusCode: 403, message: 'Account creation is not open' })
  }

  const body = await readBody(event)
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const name = String(body.name ?? '').trim() || undefined

  if (!EMAIL_RE.test(email)) throw createError({ statusCode: 400, message: 'Enter a valid email address' })
  if (password.length < 8) throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })

  const col = await getUsersCollection()
  if (await col.findOne({ email })) {
    throw createError({ statusCode: 409, message: 'An account with that email already exists' })
  }

  const passwordHash = await hashPassword(password)
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const now = new Date().toISOString()
  await col.insertOne({ _id: id as any, email, passwordHash, name, createdAt: now })

  return { id, email, name }
})
