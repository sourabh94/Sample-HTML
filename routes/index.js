var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('/index.html');
});


router.get('/about', function(req, res, next) {
  res.sendfile('./public/pages/about.html');
});

router.get('/gallery/photo/:page', function(req, res, next) {
  console.log('This came in as param ',req.params.page);
  if (req.params.page==='0')
  	res.sendfile('./public/pages/gallery.html');	
  else
  	res.sendfile('./public/pages/gallery'+req.params.page+'.html');
});

router.get('/gallery/video', function(req, res, next) {
  res.sendfile('./public/pages/video.html');
});

router.get('/product/:id', function(req, res, next) {
  //console.log(req.params.id);
  res.sendfile('./public/pages/'+req.params.id+'.html');
});

router.get('/career', function(req, res, next) {
  res.sendfile('./public/pages/career.html');
});

router.get('/businessEnquiry', function(req, res, next) {
  res.sendfile('./public/pages/businessEnquiry.html');
});

router.get('/contact', function(req, res, next) {
  res.sendfile('./public/pages/contact.html');
});

router.post('/contact', function(req, res, next) {
  console.log(req.body);
  res.sendfile('./public/pages/contact.html');
});

module.exports = router;
