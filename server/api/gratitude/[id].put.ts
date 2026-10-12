import { getGratitudeCollection } from '~/server/utils/db'
import { cleanGoodThings } from '~/server/utils/gratitude'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const things = cleanGoodThings(body.things)
  if (!things.length) throw createError({ statusCode: 400, message: 'At least one good thing is required' })
  const col = await getGratitudeCollection()
  const result = await col.findOneAndUpdate({ _id: id as any, userId }, { $set: { things, updatedAt: new Date().toISOString() } }, { returnDocument: 'after' })
  if (!result) throw createError({ statusCode: 404, message: 'Entry not found' })
  const { _id, ...rest } = result
  return { id: _id, ...rest }
})
