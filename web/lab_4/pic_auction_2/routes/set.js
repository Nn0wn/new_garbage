//@flow

const express = require("express");
const router = express.Router();
const winston = require('../logger');

let pictures = require('../data/gallery');
let settings = require('../data/settings');

router.get('/picture/:id', (req, res, next)=>{
    let num = req.params.id;
    res.json(pictures[num]);
});

router.get('/gallery', (req, res, next)=>{
    res.json(pictures);
});

router.get('/settings', (req, res, next)=>{
    res.json(settings);
});

router.put('/', (req, res, next)=>{
    let data = req.body;
    pictures = data.gal;
    winston.verbose("Something changed in our gallery!");
    res.json(pictures);
});

module.exports = router;