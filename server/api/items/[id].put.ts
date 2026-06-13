import { getCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const now = new Date().toISOString()

  const { id: _ignored, _id: _ignored2, createdAt: _ignored3, ...fields } = body
  const update = { ...fields, updatedAt: now }

  const col = await getCollection()
  const result = await col.findOneAndUpdate(
    { _id: id as any },
    { $set: update },
    { returnDocument: 'after' }
  )
  if (!result) throw createError({ statusCode: 404, message: 'Item not found' })
  const { _id, ...rest } = result
  return { id: _id, ...rest }
})
