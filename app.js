var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var prerender = require('prerender-node').set('prerenderToken', 'kV4grh1WykGJeuWMKIkJ');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', users);


  // Here we require the prerender middleware that will handle requests from Search Engine crawlers 
  // We set the token only if we're using the Prerender.io service 
  app.use(prerender); 
app.get('/*', function(req, res){ 
  res.sendfile('./public/index.html'); 
});
app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
