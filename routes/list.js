const express = require('express');

const firebase = require('firebase')
const db = firebase.firestore();

var router = express.Router({ mergeParams: true });

/* GET list. */
router.get('/', (req, res) => {
  const { server_code } = req.params

  // Run when client connected
  res.io.on('connection', socket => {

    socket.emit('protocol', 'List socket connected!')

    db.collection(`server/${server_code}/lists`)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
          var lists = [];
          querySnapshot.forEach(doc => {
              lists.push(doc.data());
          });
          socket.emit('lists', lists);
      });
  })

  res.layout('list', 
      { 'title': 'List - Enlisted', 
        'layout': 'layout/index-layout',
        'nav_title' : 'List'});
});

/* Post list. */
router.get('/post', (req, res, next) => {
  const { server_code } = req.params

  res.layout('list/post', 
      { 'title': 'Post List - Enlisted', 
        'layout': 'layout/post-layout',
        'nav_title' : 'New List'});
});

/* Edit list. */
router.get('/:list_id/edit', (req, res, next) => {
  const { server_code, list_id } = req.params

  res.layout('list/edit', 
      { 'title': 'Edit List - Enlisted', 
        'layout': 'layout/edit-layout',
        'nav_title' : 'Edit List'});
});

/* View list. */
router.get('/:list_id/view', (req, res, next) => {
  const { server_code, list_id } = req.params

  res.layout('list/view', 
  { 'title': 'View List - Enlisted', 
    'layout': 'layout/view-layout',
    'nav_title' : 'List Detail'});
});

/* View list. */
router.get('/:list_id/add-me', (req, res, next) => {
  const { server_code, list_id } = req.params

  res.layout('list/add-me', 
  { 'title': 'Add Me - Enlisted', 
    'layout': 'layout/simple-layout',
    'nav_title' : 'Add me'});
});


module.exports = router;
