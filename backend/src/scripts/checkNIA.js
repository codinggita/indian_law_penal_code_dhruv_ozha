const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('Indian_Law_Panel');
    const niaDocs = await db.collection('laws').find({ actName: 'NIA' }).limit(5).toArray();
    console.log("NIA Docs Sample:", niaDocs.map(d => ({ section: d.sectionNumber, title: d.title, desc: d.description.substring(0, 30) })));
  } finally {
    await client.close();
  }
}

main().catch(console.error);
