var bodyParser = require('body-parser');
var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');

var middleware = require('./middleware');


module.exports.createUserSession = function(req, res, user) {
  var cleanUser = {
    firstName:  user.firstName,
    lastName:   user.lastName,
    email:      user.email,
    data:       user.data || {},
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
  res.locals.user = cleanUser;
};

module.exports.createApp = function() {
  mongoose.connect('mongodb://localhost/ECEdb');

  var app = express();

  // settings
  app.set('view engine', 'jade');

  // middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));
  app.use(csrf());
  app.use(middleware.simpleAuth);

  // routes
  app.use(require('./routes/auth'));
  app.use(require('./routes/main'));

  return app;
};

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
module.exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};
