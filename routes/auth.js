var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var db = firebase.firestore();

/* GET sign in page. */
router.get('/signin', isLoggedIn ,(req, res, next) => {
   res.render('auth/signin', { title: 'Sign In - Enlisted' });
});

/* GET sign up page. */
router.get('/signup', isLoggedIn ,(req, res, next) => {
  res.render('auth/signup', { title: 'Sign Up - Enlisted' });
});

function isLoggedIn(req, res, next) {
  if (req.session.uid) {
    res.redirect('/');
  } else {
      next();
  }
}
module.exports = router;
