const express = require('express');

const firebase = require('firebase')
const db = firebase.firestore();

var router = express.Router();

/* GET list. */
router.get('/', (req, res) => {

  // Run when client connected
  res.io.on('connection', socket => {

    socket.emit('protocol', 'List socket connected!')

    db.collection("lists")
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
          var lists = [];
          querySnapshot.forEach(doc => {
              lists.push(doc.data());
          });
          socket.emit('lists', lists);
      });
  })

  res.render('list', { 'title': 'List - Enlisted' });
});

/* View list. */
router.get('/:doc_id', (req, res, next) => {
  res.send('respond with a resource');
});

/* View list. */
router.get('/:doc_id/add', (req, res, next) => {
  res.send('respond with a resource');
});

/* Post list. */
router.get('/post', (req, res, next) => {
  res.send('respond with a resource');
});

/* Edit list. */
router.get('/edit/:doc_id', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
