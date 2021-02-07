var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();

/* POST create a server */
router.post('/create', isAdmin ,async(req, res, next) => {
    let currentDate = new Date().toLocaleDateString();
    let currentTime = new Date().toLocaleTimeString('en-US',{ hour12:false })
    let {serverName, serverType, userId, status,name} = req.body;

    if (serverName == ""|| serverType == "" || userId == "" || status == ""){
        errCreate(req,res,'Please fill in the required form!',serverName,serverType,userId,status);
        return false;
    };
    try {
        const createServer = await db.collection('servers').add({
            createdAt : currentDate + " " + currentTime,
            createdBy : {
                name: req.session.displayName,
                userId : req.session.uid
            },
            name : serverName,
            type : serverType,
        });
        const members = await db.collection('servers').doc(createServer.id).collection('members').add({
            role : 'admin',
            status : status,
            userId : userId,
            name: name
        });
        const addToUser = await db.doc(`users/${userId}`).update({
            "servers" : firebase.firestore.FieldValue.arrayUnion(createServer.id)
        });
        req.flash('success','Server has been created successfully.')
        res.redirect('/server/')
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('back')
    }

});

/* Post join a server */
router.post('/join', async (req, res, next) => {
    let { server_code } = req.body;
    let userId = req.session.uid;
    if(!server_code){
        errJoin(req,res,'Please enter the server code');
        return false;
    }
    try {
        let allUserServers = [];
        let allServers = [];
        let snapshotUserServers = await db.doc(`users/${userId}`).get();
        let getUserServers = snapshotUserServers.data()['servers'].forEach(userServer => {
            allUserServers.push(userServer);
        });
        let snapshotAllServers = await db.collection('servers').get();
        let getServers = snapshotAllServers.forEach(allServer => {
            allServers.push(allServer.id);
        });
        if(!allServers.includes(server_code)){
            errJoin(req,res,'Server not found');
            return false;
        }
        if(allUserServers.includes(server_code)){
            errJoin(req,res,'You have joined the server');
            return false;
        }
        try {
            const addToServer = await db.collection('servers').doc(server_code).collection('members').add({
                role : 'member',
                status : 'Anggota',
                userId : userId,
                name: req.session.displayName
            });

            const addToUser = await db.doc(`users/${userId}`).update({
                "servers" : firebase.firestore.FieldValue.arrayUnion(server_code)
            });

            req.flash('success','You have been added to the server');
            res.redirect(`/s/${server_code}/home`);
        } catch (error) {
            errJoin(req,res,error.message);
        }
    } catch (error) {
        errJoin(req,res,error.message);
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

function errCreate(req,res,msg,serverName,serverType,userId,status){
    req.flash('err',msg);
    req.flash('serverName',serverName);
    req.flash('serverType',serverType);
    req.flash('userId',userId);
    req.flash('status',status);
    res.redirect('back');
}

function errJoin(req,res,msg){
    req.flash('err',msg);
    res.redirect('back');
}

module.exports = router;
