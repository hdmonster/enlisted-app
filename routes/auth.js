var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();


/* GET sign in page. */
router.get('/signin', isLoggedIn ,async(req, res, next) => {
    // await checkAuthor('iCz78PImh2MaDs6oBhNi','MXQpKtgXt4oJNZfATHRT');
    res.render('auth/signin', { title: 'Sign In - Enlisted'});
});

/* GET sign up page. */
router.get('/signup', isLoggedIn ,(req, res, next) => {
  res.render('auth/signup', { title: 'Sign Up - Enlisted' });
});

async function checkAuthor(serverCode, listId){
    const list = await db.doc(`servers/${serverCode}/lists/${listId}`).get();
    const authorId = list.data()['author']['userId'];
    console.log(authorId);
    // if(req.session.uid != authorId){
    //     req.flash('err','You are not the owner of this list');
    //     res.redirect('back');
    //     return false;
    // }
}

function isLoggedIn(req, res, next) {
  if (req.session.uid) {
    res.redirect('/');
  } else {
      next();
  }
}
module.exports = router;
