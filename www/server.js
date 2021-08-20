const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser =  require('body-parser');

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/api/addresult', (req, res) => {
  async function addResults(){
      /**
       * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
       * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
       */
      const uri = "mongodb+srv://christer:Ice278787@oerdev.bqfcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
      const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });

      //checking for sessionId, levelId, trialNumber and trialResult
      if (req.body.appId === undefined || req.body.userId === undefined || req.body.sessionId === undefined || req.body.levelId === undefined || req.body.trialNumber === undefined || req.body.trialResult === undefined || req.body.trialTime === undefined)
      {
        res.status(400).send('One or more mandatory enteties are missing in the json');
        return;
      } else
      {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            //insert of one post in results
            await client.db("assessment").collection("results").insertOne(req.body);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
      }

  }

  addResults().catch(console.error);
  res.json("Insert of one record confirmed");
  console.log(req.body.userId);

});
app.get('/api/user/:appID/:userId', (req, res) => {

async function findResultsUi(){

  const uri = "mongodb+srv://christer:Ice278787@oerdev.bqfcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });

  await client.connect();

  const cursor = client.db("assessment").collection("results")
        .find({
            userId: { $eq: parseInt(req.params.userId)}
        })
            .sort({ userId: -1 });

  const results = await cursor.toArray();

  res.json(results);
  console.log(results);
  return;
}

findResultsUi().catch(console.error);

});

app.get('/api/app/:appId', (req, res) => {

async function findResultsUi(){

  const uri = "mongodb+srv://christer:Ice278787@oerdev.bqfcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });

  await client.connect();

  const cursor = client.db("assessment").collection("results")
        .find({
            appId: { $eq: parseInt(req.params.appId) }
        })
            .sort({ userId: -1 });

  const results = await cursor.toArray();

  res.json(results);
  console.log(results);
  return;
}

findResultsUi().catch(console.error);

});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server stared on port 8080");
});
