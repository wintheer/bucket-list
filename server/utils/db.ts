import { MongoClient, type Db } from 'mongodb'

let client: MongoClient | null = null

export async function getDb(): Promise<Db> {
  if (client) return client.db('bucket-list')

  const { mongodbUri: uri } = useRuntimeConfig()
  if (!uri) throw new Error('MONGODB_URI is not set')

  client = new MongoClient(uri)
  await client.connect()
  return client.db('bucket-list')
}

export async function getCollection() {
  const db = await getDb()
  return db.collection('items')
}

export async function getJournalCollection() {
  const db = await getDb()
  return db.collection('journal')
}

export async function getJournalsCollection() {
  const db = await getDb()
  return db.collection('journals')
}

export async function getValuesCollection() {
  return (await getDb()).collection('values')
}

export async function getWhoAmICollection() {
  return (await getDb()).collection('whoami')
}

export async function getLettersCollection() {
  return (await getDb()).collection('letters')
}

export async function getMemoriesCollection() {
  return (await getDb()).collection('memories')
}
