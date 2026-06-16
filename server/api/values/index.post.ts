import { getValuesCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const now = new Date().toISOString()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const doc = { _id: id as any, name: body.name, description: body.description, color: body.color ?? 'violet', createdAt: now }
  const col = await getValuesCollection()
  await col.insertOne(doc)
  const { _id, ...rest } = doc
  return { id: _id, ...rest }
})
