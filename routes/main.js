var express = require('express');

var utils = require('../utils');

var router = express.Router();

//opening the homepage
router.get('/', function(req, res) {
  res.render('index.jade');
});
//opening the dashboard or list
router.get('/dashboard', utils.requireLogin, function(req, res) {
  res.render('dashboard.jade');
});

module.exports = router;
