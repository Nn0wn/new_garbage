
//router.use(express.static('public'));
var express = require('express');
var router = express.Router();
const fs = require('fs');
//let info = require("../public/data/info");

function saveJSON(object, path){
    //fs.writeFile(path, JSON.stringify(object));
    fs.writeFile(path, JSON.stringify(object), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function responseOK(){
    return {
        "ok": true,
        "message": ""
    }
}
function copyObject(src) {
    return Object.assign({}, src);
}

function responseError(message){
    return {
        "ok": false,
        "message": message
    }
}


/* GET home page. */
router.get('/client', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.put('/info', (req, res, next)=>{
    let info = req.body;
    console.log(info);
    saveJSON(info, "public/data/info.json");
    res.json(responseOK());
});
class User{
    constructor(n, tel, st = '', dest, cost){
        this.name = n;
        this.telephone = tel;
        this.start_point = st;
        this.dest_point = dest;
        this.cost = cost;
    }
}
const DELIVERY_TARIFF = 100, MINIMUM_COST = 100;
var user;
var price;
var multiRoute;
var myPos;
var length = 0;

var taxistSockets = [];

var io=require('socket.io').listen(3030);
function findMaxTaxistIndex(){
    let maxIndex=-1;
    if(taxistSockets.length==0) return 0;
    for (let i = 0; i < taxistSockets.length; i++) {
        if(taxistSockets[i].taxistId>maxIndex) maxIndex=taxistSockets[i].taxistId;
    }
    return maxIndex;
}
function findTaxistNumberById(id){
    for (let i = 0; i < taxistSockets.length; i++) {
        if(taxistSockets[i].taxistId==id) return i;
    }
    return null;
}
io.sockets.on('connection', function (socket) {
    socket.on("hello",(data)=>{
//socket.json.emit('newClient', {"coordX":10,"coordY":5});
        if(findTaxistNumberById(data.number)!=null){
            socket.json.emit("helloAns",{status: "err"});
            return;
        }
        socket.json.emit("helloAns",{status: "ok"});
        socket["taxistId"] = data.number;
        socket["state"]="on";
        socket["xCoord"] = data.xCoord;
        socket["yCoord"] = data.yCoord;
        taxistSockets.push(socket);
        socket.on('disconnect', (msg)=>{
            console.log("disc"+socket.taxistId);
            taxistSockets.splice(findTaxistNumberById(socket.taxistId),1);
        });
//setInterval(() => socket.json.emit('newClient', {"coordX":10,"coordY":5}),5000);
    });
    socket.on("want_taxi",(data)=>{
        let sock = findClosestTaxist(20, 30);
        if (sock==null){
            socket.json.emit("want_taxi_Ans",{"status":"bad"})
        }
        else {
            socket.json.emit("want_taxi_Ans",{"status":"ok", "taxist": sock.taxistId})
           sock.json.emit('newClient', {
                "coordX": 10,
                "coordY": 5
            });
        }
    });
    socket.on("reach",(data)=>{
        console.log(data.taxist);
        let ii = findTaxistNumberById(data.taxist);
        taxistSockets[ii].state="on";
        taxistSockets[ii].json.emit("reach","1");
    })
});

function findClosestTaxist(clientX, clientY){
    let  sock=null;
    let rast = 1000000000;
    for (let i = 0; i < taxistSockets.length; i++) {
        if(taxistSockets[i].state=="off") continue;
        if((Math.pow(taxistSockets[i].xCoord-clientX,2) )+Math.pow(taxistSockets[i].yCoord-clientY,2)<rast) {
            sock = taxistSockets[i];
            rast = (Math.pow(taxistSockets[i].xCoord - clientX, 2)) + Math.pow(taxistSockets[i].yCoord - clientY, 2);
        }
    }
    if (sock==null) return null;
    let ii = findTaxistNumberById(sock.taxistId);
    taxistSockets[ii].state="off";
    return sock;
}
//это для проверки поиска таксиста, нужно вызывать при обращении клиента
/*setInterval(()=>{
    if(taxistSockets.length!=0)findClosestTaxist(20,30).json.emit('newClient', {"coordX":10,"coordY":5});
},5000);*/


module.exports = router;