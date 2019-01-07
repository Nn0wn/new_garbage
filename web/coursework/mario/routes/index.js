var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello' });
});

router.get('/game', function(req, res, next) {
    res.render('game', { title: 'the Game' });
});

module.exports = router;
