var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var npid = require('npid');

var app = express();

var sqlite3 = require('sqlite3').verbose();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// TODO: Move later
app.db = new sqlite3.Database('db/test.db');
app.db.serialize(function() {
    app.db.run('CREATE TABLE test (info TEXT)');
});
app.db.close();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Catch shutdown signals
process.on('SIGINT', function() {
    console.log('Caught SIGINT (Ctrl-C), stopping server');
    process.exit();
});

process.on('SIGTERM', function() {
    console.log('Caught SIGTERM (kill -15), stopping server');
    process.exit();
});

// Create PID file, delete on exit
var pid = npid.create('node.pid');
pid.removeOnExit();

module.exports = app;
