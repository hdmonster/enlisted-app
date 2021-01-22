const express = require('express');

const firebase = require('firebase')
const db = firebase.firestore();

var router = express.Router({ mergeParams: true });



module.exports = router;
