var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var db = firebase.firestore();
var router = express.Router({ mergeParams: true });

/* Post list. */
router.post('/post', isMember, async(req, res, next) => {
    const { server_code } = req.params;
    const { title,content,type,note } = req.body;
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString('en-US',{ hour12:false });

    if(title == "" || content == "" || !type){
        errPostList(req,res,'Please fill in the required form',title,content,type,note);
        return false;
    };

    if(type == "double" && note == ""){
        errPostList(req,res,'Please fill in the required form',title,content,type,note);
        return false;
    };

    try {
        const postList = await db.collection('servers').doc(server_code).collection('lists').add({
            author : {
                name : req.session.displayName,
                userId : req.session.uid
            },
            createdAt : currentDate + " " + currentTime,
            settings : {
                note : note,
                type : type
            },
            title : title,
            content : content,
        });
        req.flash('success','List has been created successfully');
        res.redirect(`/s/${server_code}/list`);
    } catch (error) {
        errPostList(req,res,error.message,title,content,type,note);
    }
});

/* Edit list. */
router.post('/:list_id/edit', isMember, async (req, res, next) => {
    const { server_code, list_id } = req.params;
    const { title,content } = req.body;
    const list = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
    const authorId = list.data()['author']['userId'];

    if(req.session.uid != authorId){
        req.flash('err','You are not the owner of this list');
        res.redirect('back');
        return false;
    }

    if(title == "" || content == ""){
        errEditList(req,res,'Please fill in the required form',title,content);
        return false;
    };

    try {

        const postList = await db.doc(`servers/${server_code}/lists/${list_id}`).update({
            title : title,
            content : content,
        });
        req.flash('success','List has been edited successfully');
        res.redirect(`/s/${server_code}/list/${list_id}/view`);
    } catch (error) {
        errEditList(req,res,error.message,title,content);
    }
});

/* Delete list. */
router.post('/:list_id/delete', isMember, async (req, res, next) => {
    const { server_code, list_id } = req.params;
    const list = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
    const authorId = list.data()['author']['userId'];

    if(req.session.uid != authorId){
        req.flash('err','You are not the owner of this list');
        res.redirect('back');
        return false;
    }

    try {
        const postList = await db.doc(`servers/${server_code}/lists/${list_id}`).delete();
        req.flash('success','List has been deleted successfully');
        res.redirect(`/s/${server_code}/list`);
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
});

/* Add Me in list. */
router.post('/:list_id/add-me', isMember, async (req, res, next) => {
    let entryList = [];
    const { server_code, list_id } = req.params;
    const { name,note } = req.body;
    const list = await db.doc(`servers/${server_code}/lists/${list_id}`).get();
    const typeList = list.data()['settings']['type'];
    const snapshotEntryList = await db.collection(`servers/${server_code}/lists/${list_id}/entry`).get();
    const getEntryList = snapshotEntryList.forEach(entry => {
        entryList.push(entry.data()['userId']);
    });

    for(entry of entryList){
        if(entry == req.session.uid){
            req.flash('err','You have added your name in this list');
            res.redirect('back');
            return false;
        }
    }

    if(typeList == 'double' && note == ""){
        errAddMe(req, res, 'Please fill in the required field');
        return false;
    }

    try {
        const addEntry = await db.collection(`servers/${server_code}/lists/${list_id}/entry`).add({
            displayName: req.session.displayName,
            userId: req.session.uid,
            nim: req.session.nim,
            note: note ? note : ''
        });
        req.flash('success','Your name has been added');
        res.redirect(`/s/${server_code}/list/${list_id}/view`);
    } catch (error) {
        errAddMe(req, res, error.message);
    }
});

async function isMember(req, res, next){
    let { server_code } = req.params;
    let userId = req.session.uid;
    try {
        let allUserServers = [];
        let snapshotUserServers = await db.doc(`users/${userId}`).get();
        let getUserServers = snapshotUserServers.data()['servers'].forEach(userServer => {
            allUserServers.push(userServer);
        });
        if(!allUserServers.includes(server_code)){
            res.redirect('back')
        }else{
            next();
        }
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
}

function errAddMe(req, res, msg){
    req.flash('err',msg);
    res.redirect('back');
}

function errPostList(req,res,msg,title,content,type,note){
    req.flash('err',msg);
    req.flash('title',title);
    req.flash('content',content);
    req.flash('type',type);
    req.flash('note',note);
    res.redirect('back');
}

function errEditList(req,res,msg,title,content){
    req.flash('err',msg);
    req.flash('title',title);
    req.flash('content',content);
    res.redirect('back');
}

module.exports = router;
