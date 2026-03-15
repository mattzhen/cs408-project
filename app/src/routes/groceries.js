var express = require('express');
var router = express.Router();

/* GET groceries page */
router.get('/groceries', function(req, res, next) {
  res.render('groceries', { title: 'My Groceries' });
});
module.exports = router;
