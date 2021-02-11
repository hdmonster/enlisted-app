var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var db = firebase.firestore();
var moment = require('moment');
var router = express.Router({ mergeParams: true });

/* Post announcement. */
router.post('/post', isMember, async(req, res, next) => {
    const { server_code } = req.params;
    const { title,content } = req.body;
    const currentDate = moment().format("DD/MM/YYYY HH:mm:ss");

    if(title == "" || content == ""){
        errPostAnn(req,res,'Please fill in the required field',title,content);
        return false;
    }

    const user = await db.collection(`servers/${server_code}/members`).where('userId','==',req.session.uid).get();
    user.forEach(doc => {
        if(doc.data()['status'] == 'Anggota' && doc.data()['role'] != 'admin' ){
            req.flash('err',"You don't have permission");
            res.redirect('back');
            return false;
        }
    });

    try{
        const postAnn = await db.collection(`servers/${server_code}/announcements`).add({
            author:{
                name: req.session.nickname,
                userId : req.session.uid
            },
            title: title,
            content: content,
            createdAt: currentDate
        });
        req.flash('success','Announcement has been created successfully');
        res.redirect(`/s/${server_code}/announcement`)
    }catch(error){
        errPostAnn(req,res,error.message,title,content);
        return false;
    }
});

/* Edit announcement. */
router.post('/:announcement_id/edit', isMember, async(req, res, next) => {
    const { server_code,announcement_id } = req.params;
    const { title,content } = req.body;

    if(title == "" || content == ""){
        errPostAnn(req,res,'Please fill in the required field',title,content);
        return false;
    }

    const snapshotAnn = await db.doc(`servers/${server_code}/announcements/${announcement_id}`).get();
    const getAnn = snapshotAnn.data();

    if(getAnn.author.userId != req.session.uid){
        req.flash('err',"You are not the owner of this announcement");
        res.redirect('back');
        return false;
    }

    try{
        const postAnn = await db.doc(`servers/${server_code}/announcements/${announcement_id}`).update({
            title: title,
            content: content,
        });
        req.flash('success','Announcement has been updated successfully');
        res.redirect(`/s/${server_code}/announcement`)
    }catch(error){
        errPostAnn(req,res,error.message,title,content);
        return false;
    }
});

/* Delete announcement. */
router.post('/:announcement_id/delete', isMember, async (req, res, next) => {
    const { server_code,announcement_id } = req.params;
    const { title,content } = req.body;

    const snapshotAnn = await db.doc(`servers/${server_code}/announcements/${announcement_id}`).get();
    const getAnn = snapshotAnn.data();

    if(getAnn.author.userId != req.session.uid){
        req.flash('err',"You are not the owner of this announcement");
        res.redirect('back');
        return false;
    }

    try {
        const postList = await db.doc(`servers/${server_code}/announcements/${announcement_id}`).delete();
        req.flash('success','Announcement has been deleted successfully');
        res.redirect(`/s/${server_code}/list`);
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
});

async function isMember(req, res, next){
    let { server_code } = req.params;
    let userId = req.session.uid;
    try {
        let allUserServers = [];
        let snapshotServerMembers = await db.collection(`servers/${server_code}/members`).get();
        let getServerMembers = snapshotServerMembers.forEach(userServer => {
            allUserServers.push(userServer.data()['userId']);
        });
        if(!allUserServers.includes(userId)){
            res.redirect('back')
        }else{
            next();
        }
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
}

function errPostAnn(req,res,msg,title,content){
    req.flash('err',msg);
    req.flash('title',title);
    req.flash('content',content);
    res.redirect('back');
}

module.exports = router;
