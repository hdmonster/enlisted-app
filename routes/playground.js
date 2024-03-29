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

router.get('/anim', (req, res, next) => {
  res.render('playground/anim', { 'title': 'Animation - Enlisted Playground' });
});

router.get('/layout', (req, res, next) => {
  res.render('layout/master', { 'title': 'Layout - Enlisted Playground' });
});

// Test Home Page
router.get('/homepage',(req, res, next) => {
  res.render('homepage');
});

// Offline Page
router.get('/offline',(req, res, next) => {
  res.render('offline');
});

module.exports = router;