var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var auth = firebase.auth();
var db = firebase.firestore();

router.get('/list/add/test',async(req, res, next) => {
    res.render('list/post',{title: 'Enlisted'});
});



router.post('/create',async(req, res, next) => {
    let currentDate = new Date().toLocaleDateString();
    let currentTime = new Date().toLocaleTimeString('en-US',{ hour12:false })
    let {serverName, serverType, userId, status,name} = req.body;

    if (serverName == ""|| serverType == "" || userId == "" || status == ""){
        errCreate(req,res,'Please fill in the required form!',serverName,serverType,userId,status);
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
        req.flash('success','Server has been created successfully.')
        res.redirect('/server/')
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('back')
    }

});

function errCreate(req,res,msg,serverName,serverType,userId,status){
    req.flash('err',msg);
    req.flash('serverName',serverName);
    req.flash('serverType',serverType);
    req.flash('userId',userId);
    req.flash('status',status);
    res.redirect('back');
}

module.exports = router;
