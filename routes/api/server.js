var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var auth = firebase.auth();
var db = firebase.firestore();


module.exports = router;
