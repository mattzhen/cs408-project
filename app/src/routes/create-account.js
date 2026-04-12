var express = require('express');
var router = express.Router();

/* GET create account page */
router.get('/create-account', function(req, res, next) {
  res.render('create-account', { title: 'Create Account', error: null, success: null, username:'' });
});

router.post('/create-account', async (req, res) => {
  const cleanUsername = req.body.username?.trim();
  const cleanPassword = req.body.pass?.trim();

  const renderError = (msg) =>
    res.status(400).render('create-account', { title: 'Create Account', error: msg, success: null, username: cleanUsername });

  if (!cleanUsername || !cleanPassword) {
    return renderError('Username and password are required.');
  }

  if (cleanUsername.length < 3 || cleanUsername.length > 32) {
    return renderError('Username must be between 3 and 32 characters.');
  }

  if (cleanPassword.length < 8 || cleanPassword.length > 72) {
    return renderError('Password must be between 8 and 72 characters.');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
    return renderError('Username can only contain letters, numbers, and underscores.');
  }

  const existingUser = req.db.getUser(cleanUsername);
  if (existingUser) {
    return renderError('Username is already taken.');
  }

  try {
    const userId = await req.db.createUser(cleanUsername, cleanPassword);
    req.session.userId = userId;
    res.render('create-account', { title: 'Create Account', error: null, success: 'Account created successfully!', username: '' });
  } catch (err) {
    console.error(err);
    res.status(500).render('create-account', { title: 'Create Account', error: 'Something went wrong. Please try again.', success: null, username: cleanUsername });
  }
});

module.exports = router;
