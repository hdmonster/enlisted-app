const express = require('express');
const firebase = require('firebase');
const db = firebase.firestore();
var router = express.Router({ mergeParams: true });


/* GET list. */
router.get('/', isMember, async (req, res) => {
  const { server_code } = req.params;

  try {
      let lists = [];
      const snapshotLists = await db.collection(`servers/${server_code}/lists`)
      .orderBy('createdAt', 'desc').get();
      const getList = snapshotLists.forEach(list => {
          const getData = list.data();
          getData.id = list.id;
          lists.push(getData);
      });
      res.layout('list',{
          'title': 'List - Enlisted',
          'layout': 'layout/index-layout',
          'nav_title' : 'List',
          'lists': lists
      });
  } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
  }

});

/* Post list. */
router.get('/post', isMember, (req, res, next) => {
  const { server_code } = req.params;

  res.layout('list/post',
      { 'title': 'Post List - Enlisted',
        'layout': 'layout/post-layout',
        'nav_title' : 'New List',
        'server_code' : server_code });
});

/* Edit list. */
router.get('/:list_id/edit', isMember , async (req, res, next) => {
    const { server_code, list_id } = req.params;

    try {
      const snapshotLists = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
      const getList = snapshotLists.data();
      if(getList.author.userId != req.session.uid){
          res.redirect('back');
          return false;
      }
      res.layout('list/edit',
          { 'title': 'Edit List - Enlisted',
            'layout': 'layout/edit-layout',
            'nav_title' : 'Edit List',
            'serverCode': server_code,
            'listId': list_id,
            'list': getList });
    } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
    }
});

/* View list. */
router.get('/:list_id/view', isMember , async (req, res, next) => {
  const { server_code, list_id } = req.params;

  res.io.on('connection', socket => {

      socket.emit('protocol', 'List socket connected!')

      db.collection(`servers/${server_code}/lists/${list_id}/entry`)
      .onSnapshot(querySnapshot => {
          let entries = [];
          let count = 0;
          querySnapshot.forEach(doc => {
              const getData = doc.data();
              entries.push(getData);
              count += 1;
          });
          socket.emit('entries', entries);
          socket.emit('count', count);
      });
  });

  try {
      const snapshotLists = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
      const getList = snapshotLists.data();
      res.layout('list/view', {
          'title': 'View List - Enlisted',
          'layout': 'layout/view-layout',
          'nav_title' : 'List Detail',
          'list': getList,
          'serverCode': server_code,
          'listId': list_id
      });
  } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
  }
});

/* Add Me. */
router.get('/:list_id/add-me', isMember, async (req, res, next) => {
    let entryList = [];
    const { server_code, list_id } = req.params;
    const snapshotEntryList = await db.collection(`servers/${server_code}/lists/${list_id}/entry`).get();
    const getEntryList = snapshotEntryList.forEach(entry => {
        entryList.push(entry.data()['userId']);
    });

    if(entryList.includes(req.session.uid)){
        req.flash('err','You have added your name in this list');
        res.redirect('back');
        return false;
    }

    try {
        const snapshotLists = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
        const getList = snapshotLists.data();
        res.layout('list/add-me', {
            'title': 'Add Me - Enlisted',
            'layout': 'layout/simple-layout',
            'nav_title' : 'Add me',
            'list': getList,
            'serverCode': server_code,
            'listId': list_id
        });
        res.render('list/add-me',{
            title: 'Enlisted',
            list: getList,
            serverCode: server_code,
            listId: list_id,
            entryList: entryList
        });
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
        let snapshotServerMembers = await db.collection(`servers/${server_code}/members`).get();
        let getServerMembers = snapshotServerMembers.forEach(userServer => {
            allUserServers.push(userServer.data()['userId']);
        });
        if(!allUserServers.includes(userId)){
            res.redirect('back')
        }else{
            next();
        }
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
}

module.exports = router;
