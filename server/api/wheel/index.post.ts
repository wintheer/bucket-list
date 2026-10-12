import { getWheelCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody(event)
  const scores: Record<string, number> = {}
  for (const [domain, score] of Object.entries(body.scores ?? {})) {
    const n = Math.round(Number(score))
    if (Number.isFinite(n)) scores[domain] = Math.min(10, Math.max(1, n))
  }
  if (!Object.keys(scores).length) throw createError({ statusCode: 400, message: 'No scores given' })
  const now = new Date().toISOString()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const doc = { _id: id as any, userId, scores, note: body.note?.trim() || undefined, createdAt: now }
  const col = await getWheelCollection()
  await col.insertOne(doc)
  const { _id, ...rest } = doc
  return { id: _id, ...rest }
})
