const express = require('express');
var router = express.Router();

router.get('/input', (req, res, next) => {
  res.render('playground/input', { 'title': 'Inputs - Enlisted Playground' });
});

router.get('/button', (req, res, next) => {
  res.render('playground/button', { 'title': 'Buttons - Enlisted Playground' });
});

module.exports = router;