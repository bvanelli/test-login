var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  if(req.query.fail)
    res.render('signup', { message: 'Falha no cadastro do usuário!' });
  else
    res.render('signup', { message: null });
})

module.exports = router;
