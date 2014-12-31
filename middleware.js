var models = require('./models');
var utils = require('./utils');

//a middleware of express that will load users from session data

module.exports.simpleAuth = function(req, res, next) {
  if (req.session && req.session.user) {
    models.User.findOne({ email: req.session.user.email }, 'firstName lastName email data', function(err, user) {
      if (user) {
        utils.createUserSession(req, res, user);
      }
      next();
    });
  } else {
    next();
  }
};
