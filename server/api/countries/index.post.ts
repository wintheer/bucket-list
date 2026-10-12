import { getCountriesCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const body = await readBody(event)
  const name = String(body.name ?? '').trim()
  if (!name) throw createError({ statusCode: 400, message: 'Country name is required' })
  const col = await getCountriesCollection()
  // Upsert so marking a country twice doesn't create duplicates
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const result = await col.findOneAndUpdate(
    { userId, name },
    { $setOnInsert: { _id: id as any, userId, name, createdAt: new Date().toISOString() } },
    { upsert: true, returnDocument: 'after' },
  )
  const { _id, ...rest } = result!
  return { id: _id, ...rest }
})
