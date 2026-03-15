var express = require('express');
var router = express.Router();

/* GET additional info page. */
router.get('/item-details', function(req, res, next) {
  res.render('item-details', { title: 'Viewing item details' });
});
module.exports = router;
