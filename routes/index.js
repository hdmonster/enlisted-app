var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.layout('index', 
      { 'title': `Enlisted`, 
        'layout': 'layout/master',
        'nav_title' : 'Enlisted'});
})

/* Join a server. */
router.get('/join/:server_code', (req, res, next) => {
  res.send('Join server')
  // if success direct to server home page
})


module.exports = router;
