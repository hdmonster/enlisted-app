const express = require('express');

const firebase = require('firebase')
const db = firebase.firestore();

var router = express.Router({ mergeParams: true });

/* GET list. */
router.get('/', isMember, (req, res) => {
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
                  const getData = doc.data();
                  getData.id = doc.id;
                  lists.push(getData);
              });
              socket.emit('lists', lists);
          });
      })
  });
  res.render('list', { 'title': 'List - Enlisted' });
});

/* Post list. */
router.get('/post', isMember, (req, res, next) => {
  const { server_code } = req.params
  res.render('list/post',{title: 'Enlisted',server_code: server_code});
});

/* Edit list. */
router.get('/:list_id/edit', isMember , async (req, res, next) => {
    const { server_code, list_id } = req.params;
    try {
      let snapshotLists = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
      let getList = snapshotLists.data();
      if(getList.author.userId != req.session.uid){
          res.redirect('back');
          return false;
      }
      res.render('list/edit', { title: 'Enlisted', serverCode: server_code, listId: list_id, list: getList });
    } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
    }
});

/* View list. */
router.get('/:list_id/view', isMember , async (req, res, next) => {
  const { server_code, list_id } = req.params;
  try {
      let snapshotLists = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
      let getList = snapshotLists.data();
      res.render('list/detail',{title: 'Enlisted', list: getList, serverCode: server_code, listId: list_id});
  } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
  }
});

async function isMember(req, res, next){
    let { server_code } = req.params;
    let userId = req.session.uid;
    try {
        let allUserServers = [];
        let snapshotUserServers = await db.doc(`users/${userId}`).get();
        let getUserServers = snapshotUserServers.data()['servers'].forEach(userServer => {
            allUserServers.push(userServer);
        });
        for(userServer of allUserServers){
            if(userServer != server_code){
                res.redirect('back')
            }else{
                next();
            }
        }
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
}

module.exports = router;
