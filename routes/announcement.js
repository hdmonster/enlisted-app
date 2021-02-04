var express = require('express');
var router = express.Router({ mergeParams: true });

/* GET announcement. */
router.get('/', (req, res, next) => {
  const { server_code } = req.params

  res.layout('announcement', 
      { 'title': 'Announcement - Enlisted', 
        'layout': 'layout/index-layout',
        'nav_title' : 'Announcement'});
});

/* Post announcement. */
router.get('/post', (req, res, next) => {
  const { server_code } = req.params

  res.layout('announcement/post', 
      { 'title': 'Post an Announcement - Enlisted', 
        'layout': 'layout/post-layout',
        'nav_title' : 'Post an Announcement'});
});

/* Edit announcement. */
router.get('/:announcement_id/edit', (req, res, next) => {
  const { server_code } = req.params

  res.layout('announcement/edit', 
      { 'title': 'Edit Announcement - Enlisted', 
        'layout': 'layout/edit-layout',
        'nav_title' : 'Edit Announcement'});
});

/* View announcement. */
router.get('/:announcement_id/view', (req, res, next) => {
  const { server_code, announcement_id } = req.params

  res.layout('announcement/view', 
  { 'title': 'View Announcement - Enlisted', 
    'layout': 'layout/view-layout',
    'nav_title' : 'Announcement Detail'});
});

module.exports = router;
