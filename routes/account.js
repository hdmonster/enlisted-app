const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const db = firebase.firestore();
const auth = firebase.auth();

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

    res.layout('account/edit',
    { 'title': 'Edit Profile - Enlisted',
      'layout': 'layout/edit-layout',
      'nav_title' : 'Edit Profile',
      'user': user
    });
});

// POST Edit account
router.post('/edit', async (req, res, next) => {
    const { bio,mobile,ig,github } = req.body;
    try {
        const update = await db.doc(`users/${req.session.uid}`).update({
            bio: bio,
            whatsapp: mobile,
            instagram: ig,
            github: github,
        });
        req.flash('success','Your account has been updated');
        res.redirect('back');
    } catch (error) {
        req.flash('err',error.message);
        req.flash('bio',bio);
        res.redirect('back');
    }
});


module.exports = router;
