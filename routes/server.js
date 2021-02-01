var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var auth = firebase.auth();
var db = firebase.firestore();

/* GET server page for admin */
router.get('/', isAdmin ,async (req, res, next) => {
    let allServers = [];
    let snapshotServers = await db.collection('servers').get();
    let getServers = snapshotServers.forEach(doc => {
        const getData = doc.data();
        getData.id = doc.id;
        allServers.push(getData);
    });
    res.render('server/index', { title: 'Enlisted', servers: allServers });
});

/* GET create server page for admin */
router.get('/create', isAdmin ,async (req, res, next) => {
    try {
        let allUsers = [];
        let snapshotUsers = await db.collection('users').get();
        let getUsers = snapshotUsers.forEach(doc => {
            const getData = doc.data();
            getData.id = doc.id;
            allUsers.push(getData);
        });
        res.render('server/create', { title: 'Enlisted', users: allUsers });
    } catch (error) {
        req.flash('error',error.message)
        res.render('server/create', { title: 'Enlisted'});
    }
});


async function isAdmin(req,res,next){
  let userId = req.session.uid;
  let admin = await db.doc(`admins/${userId}`).get();
  if(admin.exists){
    next();
  }else{
    res.redirect('back');
  }
}

module.exports = router;
