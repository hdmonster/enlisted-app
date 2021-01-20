var express = require('express');
var router = express.Router({ mergeParams: true });

/* GET home page. */
router.get('/', (req, res, next) => {
  const { server_code } = req.params

  res.render('poll', { title: 'Polls - Enlisted' });
});

/* GET komting page. */
router.get('/create', (req, res) => {
  const { server_code } = req.params

  res.send('create poll page')
})

router.get('/:poll_id/edit', (req, res, next) => {
  const { server_code, poll_id } = req.params

    res.send('Edit poll page')
});

router.get('/:poll_id/view', (req, res, next) => {
  const { server_code, poll_id } = req.params

  res.send('Poll detail page')
});

module.exports = router;
