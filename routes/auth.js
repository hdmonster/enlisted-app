var express = require('express');
var router = express.Router();
const firebase = require('firebase')
const db = firebase.firestore();

/* GET sign in page. */
router.get('/signin', (req, res, next) => {
  res.render('auth/signin', { title: 'Sign In - Enlisted' });
  // res.send('test')
});

/* GET sign up page. */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup', { title: 'Sign Up - Enlisted' });
});

/* POST sign up. */
router.post('/signup', (req, res, next) => {
  var name = req.body.name;
  var password = req.body.password;
  var email = req.body.email;
  var nickname = name.split(" ")[0];
  var nim = email.split("@")[0];
  var splitEmail = email.split("@")[1];
  if(splitEmail != "student.itk.ac.id"){
    req.flash('err','Pastikan menggunakan akun ITK');
    req.redirect('/auth/signin');
  }else{
    firebase.auth().createUserWithEmailAndPassword(email,password)
      .then((user) => {
        return db.collection('users').doc(user.uid).set({
          avatarUrl : "https://i.pinimg.com/originals/5c/10/6e/5c106e7f7095aef477091236a41d3d57.png",
          isActive : true,
          name : name,
          nickname : nickname,
          nim : nim,
          role : "user",
          servers : []
        })
      }).then(() => {
        req.flash('success','Berhasil membuat akun!');
        res.redirect('/auth/signin')
      }).catch((error) => {
        req.flash('err',error.message);
        res.redirect('/auth/signup');
      })
  }
  // res.send(name + " " + email + " " + nickname + " " + nim + " ");
  // console.log(name + " " + email + " " + nickname + " " + nim + " ");
});


module.exports = router;
