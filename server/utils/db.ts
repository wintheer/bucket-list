import { MongoClient, type Db } from 'mongodb'

// Share one connection attempt between concurrent requests, and forget it if it
// fails so the next request retries instead of reusing a closed client
let clientPromise: Promise<MongoClient> | null = null

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    const { mongodbUri: uri } = useRuntimeConfig()
    if (!uri) throw new Error('MONGODB_URI is not set')

    clientPromise = new MongoClient(uri).connect().catch((err) => {
      clientPromise = null
      throw err
    })
  }
  return (await clientPromise).db('bucket-list')
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

export async function getUsersCollection() {
  return (await getDb()).collection('users')
}

export async function getWheelCollection() {
  return (await getDb()).collection('wheel')
}

export async function getVisionsCollection() {
  return (await getDb()).collection('visions')
}

export async function getGratitudeCollection() {
  return (await getDb()).collection('gratitude')
}

export async function getCountriesCollection() {
  return (await getDb()).collection('countries')
}
