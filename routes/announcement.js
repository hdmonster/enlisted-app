var express = require('express');
var router = express.Router({ mergeParams: true });

/* GET announcement. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* Post announcement. */
router.get('/post', (req, res, next) => {
  res.send('respond with a resource');
});

/* Edit announcement. */
router.get('/:announcement_id/edit', (req, res, next) => {
  res.send('respond with a resource');
});

/* View announcement. */
router.get('/:announcement_id/view', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
