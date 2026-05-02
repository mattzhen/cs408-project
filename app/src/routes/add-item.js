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

  // Validate required fields
  if (!item_name || !quantity || !section) {
    return res.status(400).send('Missing required fields');
  }

  // Validate quantity is a positive integer
  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity < 1) {
    return res.status(400).send('Quantity must be a positive number');
  }

  // Validate cost if provided
  if (cost) {
    const parsedCost = parseFloat(cost);
    if (isNaN(parsedCost) || parsedCost < 0 || !/^\d+(\.\d{1,2})?$/.test(cost)) {
      return res.status(400).send('Cost must be a positive number with up to two decimal places');
    }
  }

  req.db.createItem(req.session.userId, item_name, section, quantity, cost || null, brand || null);

  res.redirect('/groceries');
});

module.exports = router;
