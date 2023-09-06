const express = require('express');
const functions = require('firebase-functions');
const { db } = require('./fbconfig');


const app = express();

const cors = require('cors');
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  return res.status(200).send('Thanks for looking!');
}
);

app.post('/api/createUser', async (req, res) => {
  (async () => {
    try {
      await db.collection('users').doc('/' + req.body.id + '/')
      .create ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      return res.status(200).send('User created');
      
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});



exports.outrekms = functions.https.onRequest(app);