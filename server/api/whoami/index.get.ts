import { getWhoAmICollection } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const col = await getWhoAmICollection()
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray()
  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
})
