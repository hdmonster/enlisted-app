const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const db = firebase.firestore();
const auth = firebase.auth();
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: 'public/images/avatar/',
    filename: function (req, file, cb) {
      cb(null, new Date().getMilliseconds() + '_' + file.originalname)
    }
})

const upload = multer({ storage })

/* GET account profile. */
router.get('/', async (req, res, next) => {
    const snapshotUser = await db.doc(`users/${req.session.uid}`).get();
    const user = snapshotUser.data();
    res.layout('account',
      { 'title': 'Account - Enlisted',
        'layout': 'layout/master',
        'nav_title' : 'Account',
        'user': user
    });
});

// Edit account
router.get('/edit', async (req, res, next) => {
    const snapshotUser = await db.doc(`users/${req.session.uid}`).get();
    const user = snapshotUser.data();

    const { bio, instagram, github, whatsapp } = user

    req.session.bio = bio
    req.session.instagram = instagram
    req.session.github = github
    req.session.whatsapp = whatsapp

    res.layout('account/edit',
    { 'title': 'Edit Profile - Enlisted',
      'layout': 'layout/edit-layout',
      'nav_title' : 'Edit Profile',
      'user': user
    });
});

// POST Edit account
router.post('/edit', async (req, res, next) => {
    const { bio, whatsapp, instagram, github } = req.body;
    
    try {
        const update = await db.doc(`users/${req.session.uid}`).update({
            bio,
            whatsapp,
            instagram,
            github,
        });

        req.session.bio = bio
        req.session.instagram = instagram
        req.session.github = github
        req.session.whatsapp = whatsapp

        req.flash('success','Profile updated');
        res.redirect('/account');
    } catch (error) {
        req.flash('err',error.message);
        req.flash('bio',bio);
        res.redirect('back');
    }
});

// POST Edit account
router.post('/upload-avatar', upload.single('avatar'), async (req, res, next) => {

    try {
        console.log(req.file);

        const photoURL = '/images/avatar/' + req.file.filename

        const update = await db.doc(`users/${req.session.uid}`).update({
            photoURL
        });

        req.session.photoURL = photoURL

        req.flash('success','Your avatar has been updated');
        res.redirect('back');
    } catch (error) {
        req.flash('err',error.message);
        req.flash('bio',bio);
        res.redirect('back');
    }
});


module.exports = router;
