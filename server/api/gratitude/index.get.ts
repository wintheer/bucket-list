import { getGratitudeCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const col = await getGratitudeCollection()
  const docs = await col.find({ userId }).sort({ date: -1 }).toArray()
  return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }))
})
