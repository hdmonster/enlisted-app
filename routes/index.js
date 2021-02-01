var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var db = firebase.firestore();

/* GET home page. */
router.get('/', async (req, res, next) => {
    let allMyServers = []
    let snapshotMyServers = await db.doc('users/' + req.session.uid).get();
    let myServers = snapshotMyServers.data()['servers'];
    let snapshotServers = await db.collection('servers').get();
    let getServers = snapshotServers.forEach(doc => {
        const getData = doc.data();
        getData.id = doc.id;
        myServers.forEach((server, index) => {
            if(server == getData.id){
                allMyServers.push(getData);
            }
        });
    });
    res.render('index', { title: 'Enlisted', myServers: allMyServers });
});

/* GET account page. */
router.get('/account', (req, res, next) => {
  res.render('account/home-account', { title: 'Account - Enlisted' });
});

/* Join a server. */
router.get('/s/:server_code', (req, res) => {
  res.send('Join server')
  // if success direct to server home page
})


module.exports = router;
