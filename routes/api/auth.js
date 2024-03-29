var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var auth = firebase.auth();
var db = firebase.firestore();

// TODO: import callServerList
const server = require('./admin-server')

/* POST sign up. */
router.post('/signup', async(req, res) => {
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
    });
    const userCollection = await db.collection('users').doc(cred.uid).set({
      bio : "",
      nim : nim,
      displayName: displayName,
      fullName : fullName,
      nickname : nickname,
      servers : [],
      instagram: "",
      github: "",
      whatsapp: "",
      photoURL : "https://i.stack.imgur.com/l60Hf.png",
    });
    req.session.uid = cred.uid;
    req.session.displayName = displayName;
    req.session.fullName = fullName;
    req.session.nickname = nickname;
    req.session.nim = nim;

    const refreshUserServer = await callServerList(req)

    req.flash('success','Your account has been created successfully.');
    res.redirect('/');
  } catch (error) {
    errSignUp(req,res,error.message,fullName,nickname,email)
  }
});

/* POST sign in. */
router.post('/signin', async (req, res) => {
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

    const refreshUserServer = await callServerList(req)

    req.flash('success','You are logged in');
    res.redirect('/');
  } catch (error) {
    req.flash('err',error.message);
    res.redirect('back')
  }
});

/* POST reset password. */

router.post('/reset', async (req, res) => {
  const { email } = req.body;

  try {
    const sendResetLink = await auth.sendPasswordResetEmail(email)

    req.flash('success','The email with further instructions was sent to the submitted email address. If you don’t receive a message in 5 minutes, check the junk folder.');
    res.redirect('back');
  } catch (error) {
    req.flash('err',error.message)
    res.redirect('back');
  }
  
})

/* GET sign out. */
router.get('/signout', async (req, res) => {
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

module.exports = router;
