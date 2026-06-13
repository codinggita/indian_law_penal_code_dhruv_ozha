const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const adminDb = client.db().admin();
    const listDatabases = await adminDb.listDatabases();

    console.log("Databases:");
    for (const dbInfo of listDatabases.databases) {
      console.log(`- ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      if (collections.length > 0) {
        console.log(`  Collections: ${collections.map(c => c.name).join(', ')}`);
        // If it has laws, count them
        if (collections.find(c => c.name === 'laws')) {
            const count = await db.collection('laws').countDocuments();
            console.log(`  -> Contains 'laws' collection with ${count} documents.`);
        }
      }
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
