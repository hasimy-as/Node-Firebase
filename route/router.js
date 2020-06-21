import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import firebase from 'firebase-admin';

import serviceAccount from '../serviceKey.json';

const route = express.Router();

const csrfMiddleware = csrf({ cookie: true });

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-url.firebaseio.com',
});

route.use(cookieParser());
route.use(csrfMiddleware);
route.use(bodyParser.json());

route.all('*', (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

route.get('/login', (req, res) => res.render('login'));

route.get('/signup', (req, res) => res.render('signup'));

route.get('/profile', (req, res) => {
  const sessionCookie = req.cookies.session || '';

  firebase.auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      res.render('profile');
    })
    .catch((err) => {
      res.redirect('/login');
      new Error('Cookies unknown');
    });
});

route.get('/', (req, res) => res.render('index'));

route.post('/sessionLogin', (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  firebase.auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      },
      (err) => {
        res.status(401).send('Request unauthorized');
      }
    );
});

route.get('/sessionLogout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/login');
});

export default route;