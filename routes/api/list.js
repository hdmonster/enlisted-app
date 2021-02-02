var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var db = firebase.firestore();
var router = express.Router({ mergeParams: true });

router.post('/post', async(req, res, next) => {
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
        req.flash('msg','List has been created successfully');
        res.redirect(`/s/${server_code}/list`);
    } catch (error) {
        errPostList(req,res,error.message,title,content,type,note);
    }
});

router.post('/:list_id/edit', async (req, res, next) => {
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
        req.flash('msg','List has been edited successfully');
        res.redirect(`/s/${server_code}/list/${list_id}/view`);
    } catch (error) {
        errEditList(req,res,error.message,title,content);
    }
});

router.post('/:list_id/delete', async (req, res, next) => {
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
        req.flash('msg','List has been deleted successfully');
        res.redirect(`/s/${server_code}/list`);
    } catch (error) {
        errEditList(req,res,error.message,title,content);
    }
});

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
