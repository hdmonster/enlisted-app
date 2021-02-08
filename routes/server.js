var express = require('express');
var router = express.Router({ mergeParams: true });
var firebase = require('firebase')
var auth = firebase.auth();
var db = firebase.firestore();


/* GET home page. */
router.get('/home', async(req, res, next) => {
  const { server_code } = req.params;
  const snapshotServer = await db.doc(`servers/${server_code}`).get();
  const server_name = snapshotServer.data()['name'];
  res.layout('home',
      { 'title': `${server_name} - Enlisted`,
        'layout': 'layout/home-layout',
        'nav_title' : server_name});
});

/* GET komting page. */
router.get('/komting', (req, res) => {
  res.send('Komting page')
})

/* GET bph page. */
router.get('/bph', (req, res) => {
  res.send('Bph page')
})

/* GET mahasiswa page. */
router.get('/mahasiswa', (req, res) => {
  res.send('Mahasiswa page')
})

/* GET mahasiswa search page. */
router.get('/mahasiswa/results', (req, res) => {
  res.send('Mahasiswa search page')
})

/* GET mahasiswa detail page. */
router.get('/mahasiswa/id/:docs_uid/view', (req, res) => {
  res.send('Mahasiswa profile page')
})

module.exports = router;
