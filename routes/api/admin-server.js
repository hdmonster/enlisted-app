var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();
var moment = require('moment');

/* POST create a server */
router.post('/create', isAdmin ,async(req, res, next) => {
    const currentDate = moment().format("DD/MM/YYYY HH:mm:ss");
    let {serverName, serverType, userId, status,name} = req.body;
    if (serverName == ""|| serverType == "" || userId == "" || status == ""){
        errCreate(req,res,'Please fill in the required form!',serverName,serverType,userId,status);
        return false;
    };
    try {
        let serverId = getRandomString();
        const createServer = await db.doc(`servers/${serverId}`).set({
            createdAt : currentDate,
            createdBy : {
                name: req.session.fullName,
                userId : req.session.uid
            },
            name : serverName,
            type : serverType,
            icon: ""
        });
        
        const members = await db.collection(`servers/${serverId}/members`).add({
            role : 'admin',
            status : status,
            userId : userId,
            name: name
        });

        const addToUser = await db.collection(`users/${userId}/servers`).add({
            server_id : serverId
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
        let snapshotUserServers = await db.collection(`users/${userId}/servers`).get();
        let getUserServers = snapshotUserServers.forEach(userServer => {
            allUserServers.push(userServer.data()['server_id']);
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
                name: req.session.fullName
            });

            const addToUser = await db.collection(`users/${userId}/servers`).add({
                server_id : server_code
            });

            const refreshUserServer = await callServerList(req)

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

function getRandomString() {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 6; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
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

async function callServerList(req){
    const db = firebase.firestore();
    
    const user_id = req.session.uid
  
    const query = await db.collection(`users/${user_id}/servers`).get()
  
    let userServerIds = []
    let userServers = req.session.userServers = []
  
    query.forEach(doc => userServerIds.push(doc.data().server_id))
  
    const snapshotServer = await db.collection(`servers`).get();
    const getServer = snapshotServer.forEach(server => {
      if(userServerIds.includes(server.id)){
        const { icon, name } = server.data()
  
        userServers.push({ id : server.id, name, icon })
      }
    })

    console.log('server list added to session');
    console.log(userServers);
}

module.exports = router
