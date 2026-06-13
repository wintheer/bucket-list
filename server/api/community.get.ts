import { getCollection } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const col = await getCollection()
  const docs = await col
    .find({ isPrivate: { $ne: true } }, { projection: { title: 1, category: 1 } })
    .limit(500)
    .toArray()
  const seen = new Set<string>()
  const result: { title: string; category: string }[] = []
  for (const doc of docs) {
    const key = String(doc.title ?? '').trim().toLowerCase()
    if (!key) continue
    if (!seen.has(key)) {
      seen.add(key)
      result.push({ title: doc.title as string, category: doc.category as string })
    }
  }
  return result
})
