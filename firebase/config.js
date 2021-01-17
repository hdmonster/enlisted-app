var firebase = require('firebase')

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCWDH5NLqW3em48_awNTeCaweUaF2uzMUc",
    authDomain: "enlisted-65205.firebaseapp.com",
    databaseURL: "https://enlisted-65205.firebaseio.com",
    projectId: "enlisted-65205",
    storageBucket: "enlisted-65205.appspot.com",
    messagingSenderId: "77655412593",
    appId: "1:77655412593:web:af62c49cd94738be2630d0",
    measurementId: "G-2EE7P5GWSM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

module.exports = firebase