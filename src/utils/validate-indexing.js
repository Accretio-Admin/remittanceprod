const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://remittancev2:1bIvCxexGS0VyDlzYc5RG6xXu7zBOO5ThWz4zHLa1Ap8GMWvqIcGrRrhilIElA5RSIRYbf1es3WpACDbyNiWnQ==@remittancev2.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@remittancev2@';
const DATABASE_NAME = 'test';

async function main() {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  const db = client.db(DATABASE_NAME);
  const collections = [
    'accesslevels',
    'credentials',
    'landbankcredentialsassignments',
    'landbanktransactions',
    'logs',
    'tokens',
    'users',
    'userlimitations',
    'apigroups',
    'apitokens',
    'configs',
    'greenregions'
  ];

  for (const collectionName of collections) {
    console.log(`Indexes for collection '${collectionName}':`);

    const indexes = await db.collection(collectionName).indexes();
    indexes.forEach((index) => {
      console.log(index);
    });

    console.log('\n');
  }

  await client.close();
}

main().catch(console.error);
