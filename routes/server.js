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
router.get('/pengurus', (req, res) => {
  res.layout('home/pengurus', 
      { 'title': 'Pengurus - Enlisted', 
        'layout': 'layout/simple-layout',
        'nav_title' : 'Pengurus'});
})

/* GET mahasiswa page. */
router.get('/mahasiswa', isMember , async (req, res) => {
  const { server_code } = req.params;
  try{
    let mahasiswaUserId = [];
    let allMahasiswa = [];
    const snapshotMahasiswa = await db.collection(`servers/${server_code}/members`).get();
    const getMahasiswa = snapshotMahasiswa.forEach(dataMahasiswa => {
      mahasiswaUserId.push(dataMahasiswa.data()['userId'])
    });
    const snapshotUser = await db.collection(`users`).get();
    const getUser = snapshotUser.forEach(dataUser => {
      if(mahasiswaUserId.includes(dataUser.id)){
        const getData = dataUser.data();
        getData.id = dataUser.id;
        allMahasiswa.push(getData);
      }
    })
    res.layout('home/mahasiswa',{ 
      'title': `Mahasiswa - Enlisted`, 
      'layout': 'layout/listview-layout',
      'nav_title' : 'Mahasiswa',
      'allMahasiswa' : allMahasiswa
    });
  }catch(error){
    req.flash('err',error.message);
    res.redirect('back');
  }
})

/* GET mahasiswa search page. */
router.get('/mahasiswa/search', isMember , async (req, res) => {
  const { server_code } = req.params;
  try{
    let mahasiswaUserId = [];
    let allMahasiswa = [];
    const snapshotMahasiswa = await db.collection(`servers/${server_code}/members`).get();
    const getMahasiswa = snapshotMahasiswa.forEach(dataMahasiswa => {
      mahasiswaUserId.push(dataMahasiswa.data()['userId'])
    });
    const snapshotUser = await db.collection(`users`).get();
    const getUser = snapshotUser.forEach(dataUser => {
      if(mahasiswaUserId.includes(dataUser.id)){
        const getData = dataUser.data();
        getData.id = dataUser.id;
        allMahasiswa.push(getData);
      }
    })
    res.layout('home/mahasiswa/search', { 
      'title': 'Mahasiswa Search - Enlisted', 
      'layout': 'layout/search-layout',
      'allMahasiswa': allMahasiswa
    });
  } catch(error) {
    req.flash('err',error.message);
    res.redirect('back');
  }
})

/* GET mahasiswa detail page. */
router.get('/mahasiswa/id/:user_id/view', isMember , async (req, res) => {
  const { server_code, user_id } = req.params;
  try {
    const snapshotUser = await db.doc(`users/${user_id}`).get();
    const user = snapshotUser.data();
    const mahasiswa_name = user.fullName;
  
    res.layout('home/mahasiswa/detail', { 
      'title': 'Mahasiswa Detail - Enlisted', 
      'layout': 'layout/simple-layout',
      'nav_title' : mahasiswa_name,
      'user' : user
    });
  } catch (error) {
    req.flash('err',error.message);
    res.redirect('back');
  }
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
