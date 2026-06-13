import { getCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const col = await getCollection()
  const result = await col.deleteOne({ _id: id as any })
  if (result.deletedCount === 0) throw createError({ statusCode: 404, message: 'Item not found' })
  return { ok: true }
})
