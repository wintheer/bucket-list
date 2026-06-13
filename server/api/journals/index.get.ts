import { getJournalsCollection } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const col = await getJournalsCollection()
  const docs = await col.find({}).sort({ createdAt: 1 }).toArray()

  if (docs.length === 0) {
    const now = new Date().toISOString()
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    await col.insertOne({ _id: id as any, name: 'Personal', color: 'violet', createdAt: now })
    return [{ id, name: 'Personal', color: 'violet', createdAt: now }]
  }

  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
})
