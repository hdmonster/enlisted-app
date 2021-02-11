var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', (req, res, next) => {
  const { server_code } = req.params

  const server_name = 'Beta Server'

  res.layout('home', 
      { 'title': `${server_name} - Enlisted`, 
        'layout': 'layout/home-layout',
        'nav_title' : server_name});
});

/* GET bph page. */
router.get('/pengurus', (req, res) => {
  res.layout('home/pengurus', 
      { 'title': 'Pengurus - Enlisted', 
        'layout': 'layout/simple-layout',
        'nav_title' : 'Pengurus'});
})

/* GET mahasiswa page. */
router.get('/mahasiswa', (req, res) => {
  res.layout('home/mahasiswa', 
      { 'title': `Mahasiswa - Enlisted`, 
        'layout': 'layout/listview-layout',
        'nav_title' : 'Mahasiswa'});
})

/* GET mahasiswa search page. */
router.get('/mahasiswa/search', (req, res) => {
  res.layout('home/mahasiswa/search', 
      { 'title': 'Mahasiswa Search - Enlisted', 
        'layout': 'layout/search-layout'});
})

/* GET mahasiswa detail page. */
router.get('/mahasiswa/id/:docs_uid/view', (req, res) => {
  const mahasiswa_name = 'Russel Van Dulken'

  res.layout('home/mahasiswa/detail', 
      { 'title': 'Mahasiswa Detail - Enlisted', 
        'layout': 'layout/simple-layout',
        'nav_title' : mahasiswa_name});
})

module.exports = router;
