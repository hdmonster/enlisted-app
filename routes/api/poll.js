var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var moment = require('moment');
var db = firebase.firestore();
var router = express.Router({ mergeParams: true });

/* Post poll. */
router.post('/post', isMember ,async(req, res, next) => {
    const { server_code } = req.params;
    const currentDateTime = moment().format("DD/MM/YYYY HH:mm:ss");
    let { question,showAfterVote, openPoll, datetime_available } = req.body;
    let isAlwaysAvailable = openPoll == 'on' ? true : false; 
    let startDate = "";
    let endDate = "";
    let option = [];
    let vote_option = req.body['vote_option[]'];

    showAfterVote = showAfterVote == 'on' ? 'on' : 'off';
    openPoll = openPoll == 'on' ? 'on' : 'off';

    if(question == "" || showAfterVote == "" || openPoll == ""){
        errPostPoll(req,res,"Please fill in the required field",question, showAfterVote, openPoll, datetime_available);
        return false;
    }

    if(openPoll == 'off' && datetime_available == ""){
        errPostPoll(req,res,"Please fill in the required field",question, showAfterVote, openPoll, datetime_available);
        return false;
    }

    for (let i=0; i < vote_option.length; i++) { 
        if(vote_option[i] == ""){ 
            continue;
            return false; 
        }
        option.push({
            item: vote_option[i],
            count: 0
        });
        
    }

    if(option.length < 2 ){
        errPostPoll(req,res,"Please fill in at least 2 options",question, showAfterVote, openPoll, datetime_available);
        return false;
    }

    if(datetime_available != ""){
        startDate = datetime_available.split("-")[0];
        endDate = datetime_available.split("- ")[1];
    }

    try {
        const postPoll = await db.collection(`servers/${server_code}/polls`).add({
            author : {
                name: req.session.displayName.split('AKA ')[1],
                userId: req.session.uid
            },
            question: question,
            settings:{
                availability:{
                    startDate: startDate,
                    endDate: endDate,
                },
                showAfterVote: showAfterVote == 'on' ? true : false,
                isAlwaysAvailable: isAlwaysAvailable,
            },
            option: option,
            voter: [],
            createdAt: currentDateTime
        });
        req.flash('success','Poll has been created successfully');
        res.redirect(`/s/${server_code}/poll`);
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
});

/* Vote poll. */
router.post('/:poll_id/vote',isMember , async(req, res, next) => {
    const { server_code, poll_id } = req.params;
    const { vote_option } = req.body;
    const currentDate = moment().format("DD/MM/YYYY HH:mm:ss");
    const poll = await db.doc(`servers/${server_code}/polls/${poll_id}`);
    const snapshotPoll = await poll.get();
    const userVote = snapshotPoll.data()['voter'];
    userVote.forEach(voter => {
        if(voter.userId == req.session.uid){
            req.flash('err','You have been voted')
            res.redirect('back');
            return false;
        }
    });

    if(vote_option == undefined){
        req.flash('err','Choose one to vote');
        res.redirect('back');
        return false;
    }

    try{
        await db.runTransaction(async (t) =>{
            let options = [];
            const getPoll = await t.get(poll);
            const getOption = getPoll.data()['option'].forEach(option => {
                options.push({
                    count: option.item == vote_option ? option.count + 1 : option.count,
                    item: option.item
                });
            });
            await t.update(poll, { 
                "option": options,
                "voter":firebase.firestore.FieldValue.arrayUnion({
                    name: req.session.nickname,
                    userId: req.session.uid
                })
            });
        });
        req.flash('success','You have been voted');
        res.redirect(`/s/${server_code}/poll`);
    }catch(error){
        console.log(error.message)
        res.redirect('back')
    }
});

/* Update poll. */
router.get('/:poll_id/update', isMember ,async(req, res, next) => {
    const { server_code, poll_id } = req.params;
    try {
        const refPoll = await db.doc(`servers/${server_code}/polls/${poll_id}`).get();
        const poll = refPoll.data();
        if(poll.author.userId != req.session.uid){
            req.flash('err','You are not the owner of this poll');
            res.redirect('back');
            return false;
        }
        let settings = {
            availability: {
                endDate: poll.settings.availability.endDate,
                startDate: poll.settings.availability.startDate,
            },
            isAlwaysAvailable: poll.settings.isAlwaysAvailable,
            showAfterVote: poll.settings.showAfterVote ? false : true 
        };
        const updatePoll = await db.doc(`servers/${server_code}/polls/${poll_id}`).update({
            settings: settings
        });
        req.flash('success','Poll has been updated');
        res.redirect('back');
    } catch (error) {
        req.flash('err',error);
        res.redirect('back');
    }
})

/* Delete poll. */
router.post('/:poll_id/delete',isMember , async(req, res, next) => {
    const { server_code, poll_id } = req.params;
    const poll = await db.doc(`servers/${server_code}/polls/${poll_id}`);
    const getPoll = await poll.get();
    const authorId = getPoll.data()['author']['userId'];

    if(authorId != req.session.uid){
        req.flash('err','You are not the owner of this list');
        res.redirect('back');
        return false;
    }

    try {
        const deletePoll = await poll.delete();
        req.flash('success','Poll has been deleted successfully');
        res.redirect(`/s/${server_code}/poll`);
    } catch (error) {
        req.flash('err',error.message);
        res.redirect('back');
    }
})

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

function errPostPoll(req,res,msg,question,showAfterVote,openPoll,datetime_available){
    let userOption = [];
    for(option of req.body['vote_option[]']){
        userOption.push(option);
    }
    req.flash('err',msg);
    req.flash('question',question);
    req.flash('showAfterVote',showAfterVote);
    req.flash('openPoll',openPoll);
    req.flash('datetime_available',datetime_available);
    req.flash('vote_option',userOption);
    res.redirect('back');
}

module.exports = router;
