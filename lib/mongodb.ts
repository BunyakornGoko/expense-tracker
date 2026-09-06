import { MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI env var is not set')
  // reuse the connection across hot reloads in dev and across invocations in serverless
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect()
  }
  return global._mongoClientPromise
}

export async function getDb() {
  const client = await getClientPromise()
  return client.db()
}
