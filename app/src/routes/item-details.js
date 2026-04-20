var express = require('express');
var router = express.Router();

/* GET additional info page. */
router.get('/item-details/:item_id', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  res.render('item-details', { title: 'Viewing item details' });
});
module.exports = router;
