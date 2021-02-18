const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('get-started');
});

module.exports = router;