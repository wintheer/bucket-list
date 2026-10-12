import { getVisionsCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody(event)
  if (!body.text?.trim()) throw createError({ statusCode: 400, message: 'Text is required' })
  const now = new Date().toISOString()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const doc = { _id: id as any, userId, horizonYears: Number(body.horizonYears) || 10, text: body.text.trim(), createdAt: now }
  const col = await getVisionsCollection()
  await col.insertOne(doc)
  const { _id, ...rest } = doc
  return { id: _id, ...rest }
})
