var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();


/* GET sign in page. */
router.get('/signin', isLoggedIn ,async(req, res) => {
  let serverId = getRandomString();
  let test = serverId;
  console.log(`${serverId}`);
  console.log(`${test}`);
  res.layout('auth/signin', { layout: 'layout/auth', title: 'Sign In - Enlisted' });
});

/* GET sign up page. */
router.get('/signup', isLoggedIn ,(req, res) => {
  res.layout('auth/signup', { layout: 'layout/auth', title: 'Sign Up - Enlisted' });
});

function isLoggedIn(req, res, next) {
  if (req.session.uid) {
    res.redirect('/');
  } else {
      next();
  }
}

function getRandomString() {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for ( var i = 0; i < 6; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

module.exports = router;
