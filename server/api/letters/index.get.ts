import { getLettersCollection } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const col = await getLettersCollection()
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray()
  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
})
