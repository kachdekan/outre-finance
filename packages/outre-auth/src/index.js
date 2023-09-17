const express = require('express');
const functions = require('firebase-functions');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  return res.status(200).send('Thanks for looking!');
}
);
app.use('/api', userRoutes);
app.use(notFound);
app.use(errorHandler);


exports.outreauth = functions.https.onRequest(app);