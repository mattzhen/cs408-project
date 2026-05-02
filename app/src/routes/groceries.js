var express = require('express');
var router = express.Router();

/* GET groceries page */
router.get('/groceries', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  const groceries = req.db.getGroceriesByUser(req.session.userId);
  const total = req.db.getTotalPriceByUser(req.session.userId);
  const hasNull = req.db.hasNullPrices(req.session.userId);
  res.render('groceries', { title: 'My Groceries', groceries, total, hasNull });
});

/* DELETE obtained items of user */
router.post('/delete-obtained', (req, res) => {
  const userId = req.session.userId;
  req.db.deleteObtainedItems(userId);
  res.redirect('/groceries');
});
module.exports = router;
