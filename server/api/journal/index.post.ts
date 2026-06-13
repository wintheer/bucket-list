import { getJournalCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const now = new Date().toISOString()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)

  const doc = { _id: id as any, ...body, createdAt: now, updatedAt: now }
  const col = await getJournalCollection()
  await col.insertOne(doc)

  const { _id, ...rest } = doc
  return { id: _id, ...rest }
})
