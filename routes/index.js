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
    res.layout('index',
      { 'title': `Enlisted`,
        'layout': 'layout/master',
        'nav_title' : 'Enlisted'});
});




module.exports = router;
