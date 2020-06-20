const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const firebase = require('firebase-admin');
const route = require('./route/router');

const serviceAccount = require('./serviceKey.json');

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

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Port in ${PORT}`);
});
