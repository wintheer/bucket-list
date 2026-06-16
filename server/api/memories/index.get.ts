import { getMemoriesCollection } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const col = await getMemoriesCollection()
  const docs = await col.find({}).sort({ date: -1 }).toArray()
  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
})
