const { MongoClient } = require('mongodb');

async function connectToDatabase() {
  const uri = 'mongodb://localhost:27001'; // Replace with your MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function deleteCollections() {
  const uri = 'mongodb://localhost:27001'; // Replace with your MongoDB URI
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('users'); // Replace with your database name
    const collection = db.collection('userAuth'); // Replace with your collection name

    // Update all documents in the collection to add the points field with a value of 0
    const result = await collection.updateMany({}, { $set: { points: 0 } });

    console.log(`${result.modifiedCount} documents updated.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    client.close();
  }
}

// Call the function to delete collections
deleteCollections().catch(console.error);

