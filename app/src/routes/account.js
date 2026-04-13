var express = require('express');
var router = express.Router();

router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).render('error', { error: 'Something went wrong. Please try again.' });
    }
    res.redirect('/');
  });
});

router.get('/delete-account', (req, res) => {
  try {
    req.db.deleteUser(req.session.user_id);
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).render('error', { error: 'Something went wrong. Please try again.' });
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;