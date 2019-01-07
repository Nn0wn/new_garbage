//@flow

const express = require("express");
const router = express.Router();
const winston = require('../logger');

router.get("/", (req, res, next)=>{
    res.render('index', {title: 'welcome'})
});

router.get("/info", (req, res, next)=>{
    winston.warn("Info page");
    res.render('info', {})
});

router.get("/start/:un", (req, res, next)=>{
    let name = req.params.un;
    if (name === 'Admin') {
        winston.verbose("Admin connected!");
        res.render('admin_vers', {title: 'admin'});
    }
    else res.render('client_vers', {title: name});
});

module.exports = router;