var express = require('express');
var firebase = require('firebase')
var db = firebase.firestore();
var router = express.Router({ mergeParams: true });

/* GET announcement. */
router.get('/', isMember, (req, res, next) => {
  const { server_code } = req.params

  res.io.on('connection', socket => {

      socket.emit('protocol', 'List socket connected!')

      db.collection(`servers/${server_code}/announcements`)
      .orderBy('createdAt','desc')
      .onSnapshot(querySnapshot => {
          let announcements = [];
          querySnapshot.forEach(doc => {
              const getData = doc.data();
              getData.id = doc.id;
              announcements.push(getData);
          });
          socket.emit('announcements', announcements);
      });
  });

  res.layout('announcement',{
      'title': 'Announcement - Enlisted',
      'layout': 'layout/index-layout',
      'nav_title' : 'Announcement'
  });
});

/* Post announcement. */
router.get('/post', isMember, async(req, res, next) => {
  const { server_code } = req.params

  try {
      const user = await db.collection(`servers/${server_code}/members`).where('userId','==',req.session.uid).get();
      user.forEach(doc => {
          if(doc.data()['status'] == 'Anggota'){
              req.flash('err',"You don't have permission");
              res.redirect('back');
              return false;
          }
      });
      res.layout('announcement/post', {
          'title': 'Post an Announcement - Enlisted',
          'layout': 'layout/post-layout',
          'nav_title' : 'Post an Announcement',
          'server_code' : server_code
      });
  } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
  }

});

/* Edit announcement. */
router.get('/:announcement_id/edit', isMember, async(req, res, next) => {
  const { server_code,announcement_id } = req.params;

  const snapshotAnn = await db.doc(`servers/${server_code}/announcements/${announcement_id}`).get();
  const getAnn = snapshotAnn.data();

  if(getAnn.author.userId != req.session.uid){
      req.flash('err',"You are not the owner of this announcement");
      res.redirect('back');
      return false;
  }

  try {

      res.layout('announcement/edit',{
          'title': 'Edit Announcement - Enlisted',
          'layout': 'layout/edit-layout',
          'nav_title' : 'Edit Announcement',
          'server_code': server_code,
          'announcement': getAnn,
          'announcement_id': announcement_id
      });
  } catch (error) {
      req.flash('err',error.message);
      res.redirect('back');
  }

});

/* View announcement. */
router.get('/:announcement_id/view', isMember, async(req, res, next) => {
  const { server_code, announcement_id } = req.params
  try {
      const snapshotAnn = await db.doc(`servers/${server_code}/announcements/${announcement_id}`).get();
      const getAnn = snapshotAnn.data();
      res.layout('announcement/view',{
          'title': 'View Announcement - Enlisted',
          'layout': 'layout/view-layout',
          'nav_title' : 'Announcement Detail',
          'announcement': getAnn
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
        let snapshotUserServers = await db.doc(`users/${userId}`).get();
        let getUserServers = snapshotUserServers.data()['servers'].forEach(userServer => {
            allUserServers.push(userServer);
        });
        if(!allUserServers.includes(server_code)){
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
