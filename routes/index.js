var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SI20 List' });
});

/* GET komting page. */
router.get('/komting', (req, res) => {
  res.send('Komting page')
})

/* GET bph page. */
router.get('/bph', (req, res) => {
  res.send('Bph page')
})

/* GET mahasiswa page. */
router.get('/mahasiswa', (req, res) => {
  res.send('Mahasiswa page')
})

/* GET mahasiswa search page. */
router.get('/mahasiswa/results', (req, res) => {
  res.send('Mahasiswa search page')
})

/* GET mahasiswa detail page. */
router.get('/mahasiswa/id/:docs_uid', (req, res) => {
  res.send('Mahasiswa profile page')
})

module.exports = router;
