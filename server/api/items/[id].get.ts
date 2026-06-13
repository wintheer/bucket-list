import { getCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const col = await getCollection()
  const doc = await col.findOne({ _id: id as any })
  if (!doc) throw createError({ statusCode: 404, message: 'Item not found' })
  const { _id, ...rest } = doc
  return { id: _id, ...rest }
})
