var express = require('express');
var router = express.Router();

/* GET account profile. */
router.get('/', (req, res, next) => {
    res.layout('account', 
      { 'title': 'Account - Enlisted', 
        'layout': 'layout/master',
        'nav_title' : 'Account'});
});

// Edit account
router.get('/edit', (req, res, next) => {
  res.layout('account/edit', 
    { 'title': 'Edit Profile - Enlisted', 
      'layout': 'layout/edit-layout',
      'nav_title' : 'Edit Profile'});
});

module.exports = router;
