
var express = require('express');
var app = express();
app.set('view engine', 'pug');
app.use("/publicc",express.static('public'));
app.use("/stylesheets",express.static('stylesheets'));
app.use("/lib",express.static('lib'));
app.use("/javascripts",express.static('javascripts'));
app.get('/user', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
var router = require('./routes/routes');
app.listen(3000);

