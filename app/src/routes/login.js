var express = require('express');
var router = express.Router();

/* GET create account page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log in' });
});
module.exports = router;
