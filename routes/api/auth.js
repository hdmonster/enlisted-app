var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();

/* POST sign up. */
router.post('/signup', async(req, res, next) => {
  const {fullName,nickname,email,password} = req.body;
  const displayName = fullName + " AKA " + nickname;
  const nim = email.split("@")[0];
  const splitEmail = email.split("@")[1];

  if(fullName == "" || nickname == "" || email == "" || password == ""){
    errSignUp(req,res,'Please fill in the required form!',fullName,nickname,email);
    return false;
  };

  if(typeof parseInt(nim) !== 'number' || nim.length != 8 || splitEmail != "student.itk.ac.id"){
    errSignUp(req,res,'Please use your business email! (Your NIM Here@student.itk.ac.id)',fullName,nickname,email);
    return false;
  };

  try {
    const createUser = await auth.createUserWithEmailAndPassword(email,password);
    const cred = createUser.user;
    const updateUser = await auth.currentUser.updateProfile({
      displayName: displayName,
      photoURL : "https://i.stack.imgur.com/l60Hf.png",
    });
    const userCollection = await db.collection('users').doc(cred.uid).set({
      bio : "",
      nim : nim,
      displayName: displayName,
      fullName : fullName,
      nickname : nickname,
      servers : []
    });
    req.session.uid = cred.uid;
    req.session.displayName = displayName;
    req.session.fullName = fullName;
    req.session.nickname = nickname;
    req.session.nim = nim;
    req.flash('success','Your account has been created successfully.');
    res.redirect('/');
  } catch (error) {
    errSignUp(req,res,error.message,fullName,nickname,email)
  }
});

/* POST sign in. */
router.post('/signin', async (req, res, next) => {
  const {email,password} = req.body;
  const nim = email.split("@")[0];
  const splitEmail = email.split("@")[1];

  if(email == "" || password == ""){
    errSignIn(req,res,'Please fill in the required form!',email);
  };
  if(splitEmail != "student.itk.ac.id"){
    errSignIn(req,res,'Please use your business email! (Your NIM Here@student.itk.ac.id)',email);
  };

  try {
    const signIn = await auth.signInWithEmailAndPassword(email,password);
    const cred = signIn.user;
    const fullName = cred.displayName.split("AKA")[0];
    const nickname = cred.displayName.split("AKA ")[1];
    req.session.uid = cred.uid;
    req.session.displayName = cred.displayName;
    req.session.fullName = fullName;
    req.session.nickname = nickname;
    req.session.nim = nim;
    req.flash('success','You are logged in');
    res.redirect('/');
  } catch (error) {
    req.flash('err',error.message);
    res.redirect('back')
  }
});

/* GET sign out. */
router.get('/signout', async (req, res, next) => {
  try {
    const signOut = await auth.signOut();
    req.session.destroy();
    res.redirect('/auth/signin');
  } catch (error) {
    req.flash('err',error.message)
    res.redirect('back');
  }
})


function errSignUp(req,res,msg,fullName,nickname,email){
  req.flash('err',msg);
  req.flash('fullName',fullName);
  req.flash('nickname',nickname);
  req.flash('email',email);
  res.redirect('back');
}

function errSignIn(req,res,msg,email){
  req.flash('err',msg);
  req.flash('email',email);
  res.redirect('back');
}

module.exports = router;
