var express = require('express');
var router = express.Router();

/* GET add item page */
router.get('/add-item', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  res.render('add-item', { title: 'Add to list' });
});
module.exports = router;
