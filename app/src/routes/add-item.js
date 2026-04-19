var express = require('express');
var router = express.Router();

/* GET add item page */
router.get('/add-item', function(req, res, next) {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  res.render('add-item', { title: 'Add to list' });
});

/* POST to add an item */
router.post('/add-item', (req, res) => {
  if (!res.locals.isLoggedIn) {
    return res.redirect('/login');
  }

  const { item_name, quantity, section, cost, brand } = req.body;

  req.db.createItem(req.session.user_id, item_name, section, quantity, cost || null, brand || null);

  res.redirect('/groceries');
});

module.exports = router;
