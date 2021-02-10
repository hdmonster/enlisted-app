var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();


/* GET sign in page. */
router.get('/signin', isLoggedIn ,async(req, res) => {
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
module.exports = router;
