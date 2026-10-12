// One-off migration: stamp every pre-auth document (created before userId existed)
// with the given user's id, so existing dev data isn't orphaned.
//
// Usage:
//   NUXT_MONGODB_URI=... node scripts/assign-owner.mjs you@example.com

import { MongoClient } from 'mongodb'

const email = process.argv[2]
if (!email) {
  console.error('Usage: node scripts/assign-owner.mjs <email>')
  process.exit(1)
}

const uri = process.env.NUXT_MONGODB_URI
if (!uri) {
  console.error('NUXT_MONGODB_URI is not set')
  process.exit(1)
}

const COLLECTIONS = ['items', 'journal', 'journals', 'values', 'whoami', 'letters', 'memories']

const client = new MongoClient(uri)
await client.connect()
const db = client.db('bucket-list')

const user = await db.collection('users').findOne({ email: email.trim().toLowerCase() })
if (!user) {
  console.error(`No user found with email ${email}. Register the account first, then re-run this script.`)
  await client.close()
  process.exit(1)
}

for (const name of COLLECTIONS) {
  const result = await db.collection(name).updateMany(
    { userId: { $exists: false } },
    { $set: { userId: user._id } }
  )
  console.log(`${name}: assigned ${result.modifiedCount} document(s) to ${email}`)
}

await client.close()
