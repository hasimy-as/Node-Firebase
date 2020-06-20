const express = require('express');
const route = express.Router();

route.all('*', (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

route.get('/login', (req, res) => {})
route.get('/signup', (req, res) => {});

route.get('/profile', (req, res) => {
  const sessionCookie = req.cookies.session || '';

  firebase.auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      res.render();
    })
    .catch((error) => {
      res.redirect();
    });
});

route.get('/', (req, res) => {});

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
      (error) => {
        res.status(401).send('Request unauthorized');
      }
    );
});

route.get('/sessionLogout', (req, res) => {
  res.clearCookie();
  res.redirect();
});

module.exports = route;