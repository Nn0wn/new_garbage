"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var winston_1 = require("./winston");
var StockMarket_1 = require("./api/StockMarket");
var fs = require("fs");
var market_info = require('./json/market.json');
var router = express.Router();
exports.stock_router = router;
var market = new StockMarket_1.StockMarket();
market.fromJSON(market_info);
var dummy_market = new StockMarket_1.StockMarket();
dummy_market.addDummyBrokers();
dummy_market.addDummyStocks();
function saveMarket() {
    fs.writeFile('./json/market.json', JSON.stringify(market.toJSON(0)));
}
router.get('/market/:num([0-9]{1,})', function (req, res, next) {
    var day = parseInt(req.params.num);
    winston_1.logger.verbose("Getting day " + day);
    res.send(JSON.stringify(market.toJSON(day)));
});
router.delete('/stock/:num([0-9]{1,})', function (req, res, next) {
    var id = parseInt(req.params.num);
    market.stocks.splice(id, 1);
    saveMarket();
    res.send({ ok: true });
});
router.get('/market_info', function (req, res, next) {
    res.send(JSON.stringify(dummy_market.toJSON()));
});
router.put('/stock', function (req, res, next) {
    var stock = req.body;
    winston_1.logger.verbose("Put request stock " + stock.id + " : " + stock.stock.name);
    stock.stock.params = stock.stock_params;
    market.update_stock(stock.stock, stock.id);
    saveMarket();
    res.send({ ok: true });
});
router.put('/broker', function (req, res, next) {
    var broker = req.body;
    market.update_broker(broker.broker, broker.id);
    saveMarket();
    res.send({ ok: true });
});
router.delete('/broker/:num([0-9]{1,})', function (req, res, next) {
    var id = parseInt(req.params.num);
    console.log(id);
    market.brokers.splice(id, 1);
    saveMarket();
    res.send({ ok: true });
});
