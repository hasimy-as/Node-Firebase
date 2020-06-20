import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import firebase from 'firebase-admin';
import cors from 'cors';

import route from './route/router';
import serviceAccount from './serviceKey.json';

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://express-auth-b02ef.firebaseio.com',
});

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/', route);

app.engine('html', require('ejs').renderFile);
app.use(express.static('static'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(cors());

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Port in ${PORT}`);
});
