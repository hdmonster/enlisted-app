var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var auth = firebase.auth();
var db = firebase.firestore();

/* GET list page for admin */
router.get('/list', isAdmin ,async (req, res, next) => {
    let allServers = [];
    let snapshotServers = await db.collection('servers').get();
    let getServers = snapshotServers.forEach(doc => {
        const getData = doc.data();
        getData.id = doc.id;
        allServers.push(getData);
    });
    res.render('server/list', { title: 'Enlisted', servers: allServers });
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
