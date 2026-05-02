var express = require('express');
var router = express.Router();

/* GET additional info page. */
router.get('/item-details/:itemId', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  const item = req.db.getItemDetails(req.params.itemId, req.session.userId);
  const total = req.db.getTotalPriceById(req.params.itemId);
  res.render('item-details', { title: 'Viewing item details', item, total: total, itemId: req.params.itemId });
});

router.post('/item-details/:itemId/toggle', (req, res) => {
  req.db.toggleAcquired(req.params.itemId, req.session.userId);
  res.redirect('/groceries');
});

router.post('/item-details/:itemId/delete', (req, res) => {
  req.db.deleteItem(req.params.itemId, req.session.userId);
  res.redirect('/groceries');
});
module.exports = router;
