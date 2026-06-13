import { getJournalCollection } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const col = await getJournalCollection()
  await col.deleteOne({ _id: id as any })
  return { success: true }
})
