import { getMemoriesCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const now = new Date().toISOString()
  const { id: _i, _id: _i2, createdAt: _i3, userId: _i4, ...fields } = body
  const update = { ...fields, updatedAt: now }
  const col = await getMemoriesCollection()
  const result = await col.findOneAndUpdate({ _id: id as any, userId }, { $set: update }, { returnDocument: 'after' })
  if (!result) throw createError({ statusCode: 404, message: 'Memory not found' })
  const { _id, ...rest } = result
  return { id: _id, ...rest }
})
