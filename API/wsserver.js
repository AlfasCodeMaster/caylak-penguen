require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb')
const express = require('express');
const http = require('node:http');
const WebSocket = require('ws');
const { log } = require('node:console');
const app = express()
app.use(cors());

const secretKey = 'LoveU';

// MongoDB connection
const uri = 'mongodb+srv://alfas:sa@hazirlikctf.np29qgs.mongodb.net/';

// Create a MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = 'users'

async function connect() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];



wss.on('connection', async (ws, req) => {
  // Connect to the external WebSocket when a user connects
  
  const data = await new Promise(resolve => {
    ws.on('message', event => resolve(JSON.parse(event)));
    ws.once('message', () => {});
  });

  if (!data || !data.token) {
    return ws.send(JSON.stringify({ error: 'Invalid token' }));
  }

  jwt.verify(data.token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  });
  const decoded = jwt.decode(data.token)
  const userId = decoded.userId
  const db = await connect();
  const userCollection = db.collection('userAuth')
  const user = await userCollection.findOne({"_id":new ObjectId(userId)})
  
  console.log('User connected with ID:', userId);

  if (user) {
    ws.send(JSON.stringify({ type: 'onlineStatus', online: true }));

    ws.on('message', async event => {
      const data = JSON.parse(event)
      
      if (data.message == 'ok') {
        console.log("kullanıcı geldi");
        
        userCollection.findOneAndUpdate({"_id":new ObjectId(userId)},{
          $set: { [`online`]: true }
        })
        
        // Send confirmation back to client
        ws.send(JSON.stringify({ type: 'onlineStatusConfirmed' }));
      }
    });

    ws.on('close', ()=>{
      console.log('bağlantı kapandı')
      userCollection.findOneAndUpdate({"_id":new ObjectId(userId)},{
        $set: { [`online`]: false }
      })
    })
  } else {
    ws.send(JSON.stringify({ error: 'User not found' }));
    ws.terminate();
  }
});

server.listen(3002, () => {
  console.log('WebSocket server listening on port 3002');
});