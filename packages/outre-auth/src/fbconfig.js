var admin = require("firebase-admin");

var serviceAccount = require("./clixpesa-test-auth-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
module.exports = {
  db
};