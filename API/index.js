const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')

const app = express();
const port = 3001;
const secretKey = 'L00kD@d1mt0oR!';

app.use(bodyParser.json());
app.use(cors());

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
// Mock user data (Replace this with a database in a real application)


// Middleware to authenticate requests

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const db = await connect()

  const collection = db.collection('userAuth');
  // Mock authentication (Replace this with database validation)
  const user = await collection.findOne({ "userData.username": username, "userData.password": password })
  if (!user) {
    return res.status(405).json({ message: 'Invalid credentials' });
  }
  const challengeCollection = db.collection('challenges')
  const challengeCollectionObject = await challengeCollection.findOne({ "userID": user._id });

    const challengeCollectionObjectID = challengeCollectionObject._id.toHexString();
    const token = jwt.sign({ userId: user._id.toHexString() }, secretKey, {
      expiresIn: '2h',
    });
    res.json({ message: 'Login Successful', token: token });

});

// Route to handle user login and issue JWT
app.post('/signup', async (req, res) => {
  const { username, password, grade} = req.body;

  const db = await connect()
  const terminalcollection = db.collection('terminalData')
  const copyerTerminal = await terminalcollection.findOne({"userID":-1})
  const userTerminal = { ...copyerTerminal}
  const collection = db.collection('userAuth');
  const user = await collection.findOne({ "userData.username": username})
  if (user) {
    return res.status(405).json({ message: 'Kullanıcı zaten mevcut!' });
  }
  const challengeCollection = db.collection('challenges')
  const copyer = await challengeCollection.findOne({"userID":-1})
  const userchallenge = { ...copyer}
  await collection.insertOne({"userData":{"username":username,"password":password,"grade":grade},"points":0,"profilePic":"default.gif","unlockedAvatars":{"default":true,"fes":false,"hat":false,"headset":false}})
  const newuser = await collection.findOne({"userData.username":username})
  userchallenge.userID = newuser._id
  const unlockDate = new Date()
  userchallenge.challenges[0].unlockDate = unlockDate
  userchallenge.challenges[1].unlockDate = unlockDate
  userchallenge.challenges[2].unlockDate = unlockDate
  userchallenge.challenges[7].unlockDate = unlockDate
  userTerminal.userID = newuser._id
  delete userchallenge._id
  delete userTerminal._id
  await challengeCollection.insertOne(userchallenge)
  await terminalcollection.insertOne(userTerminal)
  const token = jwt.sign({ userId: userchallenge.userID }, secretKey, {
    expiresIn: '2h',
  });
  console.log(userchallenge.userID)
  res.json({ message: 'Login Successful', token: token });
  }
);

app.post('/change-password',authenticate, async (req, res)=>{
  const {currentPass,newPass} = req.body
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const userCollection = db.collection('userAuth')
  const user = await userCollection.findOne({"_id":new ObjectId(userId)})
  try{
    if(user.userData.password == currentPass){
      userCollection.findOneAndUpdate({"_id":new ObjectId(userId)},{
        $set: { [`userData.password`]: newPass }
      })
      res.json({message:"Şifre başarıyla güncellendi!",success:true})
    }else{
      res.status(400).json({message:"Hatalı Şifre!",success:false})
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/get-profile-page',authenticate, async(req,res)=>{
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const userCollection = db.collection('userAuth')
  const challengeCollection = db.collection('challenges')
  const user = await userCollection.findOne({"_id":new ObjectId(userId)})
  const challenges = await challengeCollection.findOne({"userID":-1})
  const first10data = await challengeCollection.findOne({"userID":-2})

  const payload = {
    username:user.userData.username,
    profilePic:user.profilePic,
    points:user.points,
    solvers:[]
  }
  challenges.challenges.forEach((challenge,index)=>{
    const item = {challengeName:challenge.challengeName,solvers:first10data.challenges[index].solvers}
    payload.solvers = [...payload.solvers, item ]
  })
  res.json(payload)
})

app.get('/profilePictures', authenticate, async(req,res)=>{
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const userCollection = db.collection('userAuth')
  const user = await userCollection.findOne({"_id":new ObjectId(userId)})
  const unlockedAvatars =  Object.entries(user.unlockedAvatars)
  return res.json(unlockedAvatars)
})

app.post('/buy-hint', authenticate, async (req,res) => {
  const { challengeIndex } = req.body;
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const collection = db.collection('challenges');
  const challenges = await collection.findOne({ "userID": new ObjectId(userId) });
  const targetChallenge = challenges.challenges[challengeIndex];
  const userCollection = db.collection('userAuth')
  const user = await userCollection.findOne({"_id":new ObjectId(userId)})
  try{
    if(targetChallenge.unlocked){
      if(targetChallenge.hintUnlocked){
        res.json({status:"fail",reason:"Zaten alındı."})
      }else{
        if(user.points >= targetChallenge.points/10){
          const newPoints = user.points - (targetChallenge.points/10)
          await userCollection.updateOne({"_id":new ObjectId(userId)},{$set:{'points':newPoints }})
          await collection.updateOne({ "userID": new ObjectId(userId)}, {
            $set: { [`challenges.${challengeIndex}.hintUnlocked`]: true }
          });
          res.json({status:"success"})
          }else{
            res.json({status:"fail",reason:"Yetersiz Puan"})
          }
      }

    }else{
      res.json({status:"fail",reason:"Meydan okuma daha açılmadı"})
    }

  }catch{

  }
})

app.post('/get-challenges', authenticate, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect()
  const collection = db.collection('challenges')
  const challengeData = await collection.findOne({ "userID": new ObjectId(userId)})
  const solCount = await collection.findOne({"userID":-2})
  challengeData.challenges.forEach((data,index) => {
    if(data.hintUnlocked===false){
      delete data.hint
    }
    if(data.unlocked===false){
      delete data.challengeName
      delete data.challengeDesc
      delete data.challangeGain
      delete data.points
      delete data.fails
      delete data.keywords
      delete data.completed
      delete data.hintUnlocked
    }
    if(data.fails<2){
      delete data.keywords
    }
    delete data.flag
    delete data.unlocks
    data.solCount = solCount.challenges[index].solCount
  });
  res.json({ challenges: challengeData.challenges })
})

app.post('/flag-control', authenticate, async (req, res) => {
  const {challengeIndex, flag } = req.body;
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const collection = db.collection('challenges');
  const challenges = await collection.findOne({ "userID": new ObjectId(userId) });
  const targetChallenge = challenges.challenges[challengeIndex];
  const totalSol = await collection.findOne({"userID":-2});

  if (flag === targetChallenge.flag && targetChallenge.completed === false) {
    console.log('doğru cevap bulundu');
    await collection.updateOne({ "userID": new ObjectId(userId) }, {
      $set: { [`challenges.${challengeIndex}.completed`]: true ,[`challenges.${challengeIndex}.completeDate`]:new Date()
    }
    }
  );
  const userCollection = db.collection('userAuth')
    const user = await userCollection.findOne({"_id":new ObjectId(userId)})
    const points = targetChallenge.points + user.points
    const copySol = totalSol.challenges[challengeIndex].solvers
    copySol.push(user.userData.username)
  await collection.updateOne({"userID":-2},{
    $set: { [`challenges.${challengeIndex}.solCount`]: totalSol.challenges[challengeIndex].solCount + 1,
    [`challenges.${challengeIndex}.solvers`]: copySol}
  })


    await userCollection.updateOne({"_id":new ObjectId(userId)},{$set:{'points':points }})
    const unlockPromises = targetChallenge.unlocks.map(async (challengeIndex) => {
      await collection.updateOne({ "userID": new ObjectId(userId)}, {
        $set: { [`challenges.${challengeIndex}.unlocked`]: true,[`challenges.${challengeIndex}.unlockDate`]: new Date(), }
      });
      console.log(userId + " ID'li kullanıcı için " + challengeIndex + ' indexli meydan okuma açıldı');
    });

    // Wait for all unlockPromises to complete before sending the response
    await Promise.all(unlockPromises);

    res.json({ message: 'Doğru Cevap' });
  } else {
    await collection.updateOne({ "userID": new ObjectId(userId) }, {
      $set: { [`challenges.${challengeIndex}.fails`]: targetChallenge.fails + 1 }
    });
    res.status(400).json({ message: 'Incorrect Flag or Challenge Already Completed' });
  }
});

app.get('/get-points', authenticate, async (req, res) => {
  try {
    const db = await connect();
    const collection = db.collection('userAuth');
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    const userId = decoded.userId;

    // Fetch user data
    const user = await collection.findOne({ '_id': new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userGrade = user.userData.grade;

    // Find users with the same grade and convert cursor to array
    const users = await collection.find({ "userData.grade": userGrade }).toArray();

    // Create an array of [username, points]
    const userPointsArray = users.map(doc => [doc.userData.username, doc.points]);

    // Sort by points (ascending order)
    userPointsArray.sort((a, b) => b[1] - a[1]); // For descending order, reverse comparison

    // Get the top 20 users
    const topUserPoints = userPointsArray.slice(0, 20);

    // Send response
    res.json({ points: topUserPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Protected route that requires authentication
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.post('/execute-command', authenticate, async (req, res) => {
  const {command} = req.body
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const collection = db.collection('terminalData');
  const cursor = await collection.findOne({"userID": userId })
  const currentLevel = cursor.currentLevel
  const currentDirectory = cursor.currentDir
    const args = command.split(' ');
    const log = cursor.log
    switch(currentLevel){
      case 1:
      switch (args[0]) {
      case 'ls':
        if (currentDirectory === "flag_bu_klarasörde") {
          const returnMessage = [...log,'homework.txt grades.txt flag.txt']
            collection.updateOne({userID:new ObjectId(userId)},{
              $set: { 'log': [...log,'homework.txt grades.txt flag.txt'] }
            })
           res.json({result:returnMessage,currentDirectory:currentDirectory})
        } else {
          const returnMessage = [...log,`flag_bu_klarasörde`]
            collection.updateOne({userID:new ObjectId(userId)},{
              $set: { 'log': [...log,'flag.txt'] }
            })
           res.json({result:returnMessage,currentDirectory:currentDirectory})
        }

        break;
      case 'cd':
        // Implement cd logic here to change the current directory.
        if (args[1] === '..') {

          collection.updateOne({userID:new ObjectId(userId)},{
            $set: { 'currentDir': '~' }
          })
          res.json({result:log,currentDirectory:'~'})
        } else {
          if (args[1] && currentDirectory === "flag_bu_klarasörde") {
            const returnMessage = [...log,`bash: cd: ${args[1]}: No such file or directory`]
            collection.updateOne({userID:new ObjectId(userId)},{
              $set: { 'log': [...log,`bash: cd: ${args[1]}: No such file or directory`] }
            })
            res.json({logs:returnMessage,currentDirectory:currentDirectory})
          } else if (args[1] === "flag_bu_klarasörde" && currentDirectory==='~')
          {            collection.updateOne({userID:new ObjectId(userId)},{
            $set: { 'currentDir': 'flag_bu_klarasörde' }
          })
          res.json({result:''})
          } else if (args[1] && currentDirectory !== "flag_bu_klarasörde"){
            res.json({result:`bash: cd: ${args[1]}: No such file or directory`})
          }
        }
        break;
      case 'cat':
        // Implement cat logic here to display file contents.
        if (args[1] === 'homework.txt' && currentDirectory==="flag_bu_klarasörde") {
          res.json({result:'İngilizce: Workbook ve Student Book 3.1 Vocabulary Booster'})
        } else if (args[1] === 'grades.txt' && currentDirectory==="flag_bu_klarasörde") {
          res.json({result:'Türkçe:90\nİngilizce:40'})
        } else if (args[1] === 'flag.txt' && currentDirectory==="flag_bu_klarasörde") {
          res.json({result:'TIMTAL={L1NUX_TERMINAL_G0!}'})
        } else {
          res.json({result:`cat: ${args[1]}: No such file or directory`})
        }
        break;
      default:
        res.json({result:`Command not found: ${args[0]}`});
    }
    break;
    case 2:
      switch (args[0]) {
        case 'ls':
          if(!args[1]){
            res.json({result:'1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt 8.txt 9.txt 10.txt'})
          }else if(args[1]!=='-a'&& args[1].startsWith('-')){
            res.json({result:`ls: invalid option -- '${args[1]}'`})
          }else if(args!=='-a'&& !args[1].startsWith('-')){
            res.json({result:`ls: cannot access '${args[1]}': No such file or directory`})
          }else{
            res.json({result:'.flag.txt 1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt 8.txt 9.txt 10.txt'})
          }
          break;
        case 'cat':
          // Implement cat logic here to display file contents.
          switch(args[1]){
            case ".flag.txt":
              res.json({result:"TIMTAL={H1DD3N_F!L€S}"})
              break;
            case "1.txt":
              res.json({result:"Tamamen Yalnız Değilsin"})
              break
            case "2.txt":
              res.json({result:"Tamamen Yalnızsın"})
              break
            case "3.txt":
              res.json({result:"Bir Şey Olmasını Mı Bekliyorsun?"})
              break
            case "4.txt":
              res.json({result:"Postman, API geliştirme ve testi aşamasında kullanışlı olabiliyor"})
              break
            case "5.txt":
              res.json({result:"SQL olmayan veri tabanlarına da enjeksiyon atabilirsin"})
              break
            case "6.txt":
              res.json({result:"Yawai Mo"})
              break
            case "7.txt":
              res.json({result:"Komutlara argüman girilebildiğini biliyor muydun?"})
              break
            case "8.txt":
              res.json({result:"ARKANA BAK"})
              break
            case "9.txt":
              res.json({result:"Ah be Kaneki bu kaderi haketmiyordun..."})
              break
            case "10.txt":
              res.json({result:"Arkanda Biri Mi Var?"})
              break
            default:
              break


          }
          break;
        default:
          res.json({result:`Command not found: ${args[0]}`});
      }
      break
      case 3:
      switch (args[0]) {
      case 'ls':
          res.json({result:'-flag.txt'});


        break;
      case 'cat':
        // Implement cat logic here to display file contents.
        if(command === 'cat -- -flag.txt'|| 'cat "-flag.txt"'){
          res.json({result:"TIMTAL={S€4RCH_P4R4M€TERS}"})
        }
        break;
      default:
        res.json({result:`Command not found: ${args[0]}`});
    }
    break;
      default:
        break
  }

});

app.post('/reset-terminal', authenticate, async (req, res) => {
  const {userID} = req.body
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.decode(token);
  const userId = decoded.userId
  const db = await connect();
  const collection = db.collection('userAuth');
  const cursor = await collection.findOne({"_id": new ObjectId(userId) })
  const confirmer = cursor.token
  if(confirmer===token){
    const terminalcollection = db.collection('terminalData');
    terminalcollection.updateOne({userID:new ObjectId(userId)},{$set:{
      log:[],
      currentDir:'~'
    }})
    return res.status(200).json({message:'success'})
  }else{
    return res.status(401).json({message:'Token ve kullanici eslesmedi'})
  }


});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
