const express = require('express');
var router = express.Router();

router.get('/input', (req, res, next) => {
  res.render('playground/input', { 'title': 'Inputs - Enlisted Playground' });
});

router.get('/button', (req, res, next) => {
  res.render('playground/button', { 'title': 'Button - Enlisted Playground'});
});

router.get('/list', (req, res, next) => {
  res.render('playground/list', { 'title': 'List - Enlisted Playground' });
});

router.get('/layout', (req, res, next) => {
  res.render('layout/master', { 'title': 'Layout - Enlisted Playground' });
});

module.exports = router;