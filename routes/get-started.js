var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('get started');
})

module.exports = router;