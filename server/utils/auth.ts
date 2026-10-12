import type { H3Event } from 'h3'

export async function requireUserId(event: H3Event): Promise<string> {
  const session = await requireUserSession(event)
  return session.user.id
}
