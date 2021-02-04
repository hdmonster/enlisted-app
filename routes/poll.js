var express = require('express');
var router = express.Router({ mergeParams: true });

/* GET home page. */
router.get('/', (req, res, next) => {
  const { server_code } = req.params

  res.layout('poll', 
      { 'title': 'Poll - Enlisted', 
        'layout': 'layout/index-layout',
        'nav_title' : 'Polls'});
});

/* GET komting page. */
router.get('/post', (req, res) => {
  const { server_code } = req.params

  res.layout('poll/post', 
      { 'title': 'Post a poll - Enlisted', 
        'layout': 'layout/post-layout',
        'nav_title' : 'Post a poll'});
})

router.get('/:poll_id/edit', (req, res, next) => {
  const { server_code, poll_id } = req.params

  res.layout('poll/edit', 
  { 'title': 'Edit Poll - Enlisted', 
    'layout': 'layout/edit-layout',
    'nav_title' : 'Edit Poll'});
});

router.get('/:poll_id/view', (req, res, next) => {
  const { server_code, poll_id } = req.params

  res.layout('poll/view', 
  { 'title': 'View Poll - Enlisted', 
    'layout': 'layout/view-layout',
    'nav_title' : 'Poll Detail'});
});

module.exports = router;
