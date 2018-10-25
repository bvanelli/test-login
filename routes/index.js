var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if (!req.user) {
    res.render('login', { title: 'Express' });
  } else {
    res.send('Olá ' + req.user.username + '. <a href="/auth/logout">Logout</a>');
  }
});

module.exports = router;
