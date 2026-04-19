var express = require('express');
var router = express.Router();

/* GET groceries page */
router.get('/groceries', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  const groceries = req.db.getGroceriesByUser(req.session.user_id);
  const total = req.db.getTotalPriceByUser(req.session.user_id);
  const hasNull = req.db.hasNullPrices(req.session.user_id);
  res.render('groceries', { title: 'My Groceries', groceries, total, hasNull });
});

/* DELETE obtained items of user */
router.post('/delete-obtained', (req, res) => {
  const user_id = req.session.user_id;
  req.db.deleteObtainedItems(user_id);
  res.redirect('/groceries');
});
module.exports = router;
