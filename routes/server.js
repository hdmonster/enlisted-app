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


module.exports = router;
