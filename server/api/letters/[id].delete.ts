import { getLettersCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const col = await getLettersCollection()
  await col.deleteOne({ _id: id as any })
  return { ok: true }
})
