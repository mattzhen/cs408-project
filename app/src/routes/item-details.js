var express = require('express');
var router = express.Router();

/* GET additional info page. */
router.get('/item-details/:item_id', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  const item = req.db.getItemDetails(req.params.item_id, res.locals.user_id);
  const total = req.db.getTotalPriceById(req.params.item_id);
  res.render('item-details', { title: 'Viewing item details', item, total: total, item_id: req.params.item_id });
});

router.post('/item-details/:item_id/toggle', (req, res) => {
  req.db.toggleAcquired(req.params.item_id, res.locals.user_id);
  res.redirect('/groceries');
});

router.post('/item-details/:item_id/delete', (req, res) => {
  req.db.deleteItem(req.params.item_id, res.locals.user_id);
  res.redirect('/groceries');
});
module.exports = router;
