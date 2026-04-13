var express = require('express');
var router = express.Router();

/* GET create account page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log in', error: null});
});

router.post('/login', async function(req, res, next) {
  try {
    const user = await req.db.verifyUser(req.body.username, req.body.password);
    if (!user) {
      return res.render('login', { title:'Log in', error: 'Invalid credentials' });
    }
    req.session.user_id = user.user_id;
    res.redirect('/groceries');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
