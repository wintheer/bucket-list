import { getGratitudeCollection } from '~/server/utils/db'
import { cleanGoodThings } from '~/server/utils/gratitude'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody(event)
  const things = cleanGoodThings(body.things)
  if (!body.date || !things.length) throw createError({ statusCode: 400, message: 'Date and at least one good thing are required' })
  const now = new Date().toISOString()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const doc = { _id: id as any, userId, date: body.date, things, createdAt: now, updatedAt: now }
  const col = await getGratitudeCollection()
  await col.insertOne(doc)
  const { _id, ...rest } = doc
  return { id: _id, ...rest }
})

