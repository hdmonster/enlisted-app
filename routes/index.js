var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var db = firebase.firestore();

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.layout('index',
      { 'title': `Enlisted`,
        'layout': 'layout/master',
        'nav_title' : 'Enlisted'});
});




module.exports = router;
