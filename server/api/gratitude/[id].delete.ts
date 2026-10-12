import { getGratitudeCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = getRouterParam(event, 'id')
  const col = await getGratitudeCollection()
  await col.deleteOne({ _id: id as any, userId })
  return { ok: true }
})
