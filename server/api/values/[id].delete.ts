import { getValuesCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const col = await getValuesCollection()
  await col.deleteOne({ _id: id as any })
  return { ok: true }
})
