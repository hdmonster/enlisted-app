var express = require('express');
var router = express.Router({ mergeParams: true });
const firebase = require('firebase');
const db = firebase.firestore();

/* GET home page. */
router.get('/', isMember, async(req, res, next) => {
  const { server_code } = req.params;
  try {
    let polls = [];
    const snapshotPoll = await db.collection(`servers/${server_code}/polls`).orderBy('createdAt','desc').get();
    const getPoll = snapshotPoll.forEach(poll => {
      const getData = poll.data();
      getData.id = poll.id;
      let voter = [];
      for(voter_id of getData.voter){
        voter.push(voter_id.userId);
      }
      getData.isVoted = voter.includes(req.session.uid) ? true : false;
      polls.push(getData); 
    });
    res.layout('poll',{ 
      'title': 'Poll - Enlisted',
      'layout': 'layout/index-layout',
      'nav_title' : 'Polls',
      'polls': polls,
      'serverCode': server_code
    });
  } catch (error) {
    req.flash('err',error.message);
    res.redirect('back');
  }
});

/* GET komting page. */
router.get('/post', isMember, async(req, res) => {
  const { server_code } = req.params

  // Check Status Member
  const user = await db.collection(`servers/${server_code}/members`).where('userId','==',req.session.uid).get();
  user.forEach(doc => {
      if(doc.data()['status'] == 'Anggota' && doc.data()['role'] != 'admin' ){
          req.flash('err',"You don't have permission");
          res.redirect('back');
          return false;
      }
  });

  res.layout('poll/post', {
        'title': 'Post a poll - Enlisted',
        'layout': 'layout/post-layout',
        'nav_title' : 'Post a poll',
        'server_code': server_code
    });
})

router.get('/:poll_id/edit', isMember, (req, res, next) => {
  const { server_code, poll_id } = req.params

  res.layout('poll/edit',
  { 'title': 'Edit Poll - Enlisted',
    'layout': 'layout/edit-layout',
    'nav_title' : 'Edit Poll'});
});

router.get('/:poll_id/view', isMember, (req, res, next) => {
  const { server_code, poll_id } = req.params

  res.layout('poll/view',
  { 'title': 'View Poll - Enlisted',
    'layout': 'layout/view-layout',
    'nav_title' : 'Poll Detail'});
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
