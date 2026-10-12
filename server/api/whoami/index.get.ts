import { getWhoAmICollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const col = await getWhoAmICollection()
  const docs = await col.find({ userId }).sort({ createdAt: -1 }).toArray()
  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
})
