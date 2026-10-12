import { getUsersCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  const col = await getUsersCollection()
  const user = await col.findOne({ email })
  const invalid = () => createError({ statusCode: 401, message: 'Invalid email or password' })

  if (!user) throw invalid()
  if (!(await verifyPassword(user.passwordHash as string, password))) throw invalid()

  await setUserSession(event, { user: { id: String(user._id), email: user.email as string, name: user.name as string | undefined } })
  return { id: user._id, email: user.email, name: user.name }
})
