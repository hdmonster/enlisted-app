var express = require('express');
var router = express.Router({ mergeParams: true });
var firebase = require('firebase')
var auth = firebase.auth();
var db = firebase.firestore();


/* GET home page. */
router.get('/home', isMember ,async(req, res, next) => {
  const { server_code } = req.params;
  const snapshotServer = await db.doc(`servers/${server_code}`).get();
  const server_name = snapshotServer.data()['name'];
  res.layout('home',
      { 'title': `${server_name} - Enlisted`,
        'layout': 'layout/home-layout',
        'nav_title' : server_name});
});

/* GET bph page. */
router.get('/bph', isMember , (req, res) => {
  res.send('Bph page')
})

/* GET mahasiswa page. */
router.get('/mahasiswa', isMember , (req, res) => {
  res.layout('home/mahasiswa', 
      { 'title': `Mahasiswa - Enlisted`, 
        'layout': 'layout/listview-layout',
        'nav_title' : 'Mahasiswa'});
})

/* GET mahasiswa search page. */
router.get('/mahasiswa/search', isMember , (req, res) => {
  res.layout('home/mahasiswa/search', 
      { 'title': 'Mahasiswa Search - Enlisted', 
        'layout': 'layout/search-layout'});
})

/* GET mahasiswa detail page. */
router.get('/mahasiswa/id/:docs_uid/view', isMember , (req, res) => {
  const mahasiswa_name = 'Russel Van Dulken'

  res.layout('home/mahasiswa/detail', 
      { 'title': 'Mahasiswa Detail - Enlisted', 
        'layout': 'layout/simple-layout',
        'nav_title' : mahasiswa_name});
})

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
