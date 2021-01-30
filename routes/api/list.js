var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var db = firebase.firestore();
var router = express.Router({ mergeParams: true });

router.post('/post', async(req, res, next) => {
    const {title,content,type,note} = req.body;
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString('en-US',{ hour12:false });
    const { server_code } = req.params;
    console.log(server_code);

    if(title == "" || content == "" || type == ""){
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



function errPostList(req,res,msg,title,content,type,note){
    req.flash('err',msg);
    req.flash('title',title);
    req.flash('content',content);
    req.flash('type',type);
    req.flash('note',note);
    res.redirect('back');
}

module.exports = router;
