const express = require("express");
const router = express.Router();
const fs = require('fs');
const winston = require('../logger');

let members = require('../data/members');

function saveJSON(object, path){
    fs.writeFile(path, JSON.stringify(object));
}

router.get('/', (req, res, next)=>{
    res.json(members);
});

router.get('/budget/:id', (req, res, next)=>{
    let user = req.params.id;
    for (let mem of members)
        if (mem.name === user) {
            res.json({"money": mem.money});
            break;
        }
});

router.get('/:id', (req, res, next)=>{
    let id = req.params.id;

    if (!id)
        winston.warn("Can't resolve member name");

    for (let mem of members)
        if (mem.name === id) {
            res.json(mem);
            break;
        }
});

router.put('/:id', (req, res, next)=>{
    let name = req.params.id;

    if (!name)
        winston.warn("Name of newcomer is Undefined");

    let isHere = false;
    for (let mem of members)
        if (mem.name === name) {
            isHere = true;
        }
    if (!isHere) {
        let len = members.length;
        members[len] = {"name": name, "Aquisitions": [], "money": 1000000};
        saveJSON(members, './data/members.json');
        winston.verbose("New user in our rows:" + name);
    }
    res.json(members);
});

router.get('/', (req, res, next)=>{
    res.json(members);
});

router.put('/setaq/:id', (req, res, next)=>{
    let name = req.params.id;

    if (!name)
        winston.warn("Name of Aquisitor is Undefined");

    let picAquired = req.body;
    for (let id in members)
        if (members[id].name === name) {
            members[id].Aquisitions[members[id].Aquisitions.length] = picAquired;
            members[id].money -= parseInt(picAquired.price);
        }
    saveJSON(members, './data/members.json');
    winston.verbose("Congrats to " + name + "! This man just aquired the picture " + picAquired.name);
});

module.exports = router;

