var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.layout('index',
    { 'title': `Enlisted`,
      'layout': 'layout/master',
      'nav_title' : 'Enlisted'});
});



module.exports = router;
