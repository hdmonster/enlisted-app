const express = require('express');

const firebase = require('firebase')
const db = firebase.firestore();

var router = express.Router({ mergeParams: true });

/* GET list. */
router.get('/', (req, res) => {
  const { server_code } = req.params
  db.collection(`servers/${server_code}/lists`).get()
  .then(doc => {
      // Run when client connected
      res.io.on('connection', socket => {

          socket.emit('protocol', 'List socket connected!')

          db.collection(`servers/${server_code}/lists`)
          .orderBy('createdAt', 'desc')
          .onSnapshot(querySnapshot => {
              var lists = [];
              querySnapshot.forEach(doc => {
                  lists.push(doc.data());
              });
              socket.emit('lists', lists);
          });
      })
  });
  res.render('list', { 'title': 'List - Enlisted' });
});

/* Post list. */
router.get('/post', (req, res, next) => {
  const { server_code } = req.params
  res.render('list/post',{title: 'Enlisted',server_code: server_code});
});

/* Edit list. */
router.get('/:list_id/edit', (req, res, next) => {
  const { server_code, list_id } = req.params

  res.send('edit list page');
});

/* View list. */
router.get('/:list_id/view', (req, res, next) => {
  const { server_code, list_id } = req.params

  res.send(`View list page for id`);
});


module.exports = router;
