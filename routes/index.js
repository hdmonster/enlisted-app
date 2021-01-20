var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Enlisted' });
});

/* GET account page. */
router.get('/account', (req, res, next) => {
  res.render('account/home-account', { title: 'Account - Enlisted' });
});

/* Join a server. */
router.get('/join/:server_code', (req, res) => {
  res.send('Join server')
  // if success direct to server home page
})


module.exports = router;
