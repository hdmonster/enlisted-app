var express = require('express');
var router = express.Router();

/* GET sign in page. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin', { title: 'Sign In - Enlisted' });
  // res.send('test')
});

/* GET sign up page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup', { title: 'Sign Up - Enlisted' });
});


module.exports = router;
