var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/routes');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/html"));
app.use('/lib', express.static(__dirname + "/lib"));
app.use('/css', express.static(__dirname + "/css"));
app.use('/res', express.static(__dirname + "/res"));
app.use('/js', express.static(__dirname + "/javascripts"));
app.use('/', indexRouter);


module.exports = app;
