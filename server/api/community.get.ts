import { getCollection } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const col = await getCollection()
  const docs = await col.find({ isPrivate: { $ne: true } }).toArray()
  const seen = new Set<string>()
  const result: { title: string; category: string }[] = []
  for (const doc of docs) {
    const key = (doc.title as string).trim().toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push({ title: doc.title, category: doc.category })
    }
  }
  return result
})
