var express = require('express');
var router = express.Router();

/* GET announcement. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* View announcement. */
router.get('/:doc_id', function(req, res, next) {
  res.send('respond with a resource');
});

/* Post announcement. */
router.get('/post', function(req, res, next) {
  res.send('respond with a resource');
});

/* Edit announcement. */
router.get('/edit/:doc_id', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
