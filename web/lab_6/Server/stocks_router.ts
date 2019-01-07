import * as express from "express"
import {logger} from "./winston";
import {StockMarket} from "./api/StockMarket";
import * as fs from "fs"

declare var require: any;
const market_info = require('./json/market.json');

const router = express.Router();
const market = new StockMarket();
market.fromJSON(market_info);
const dummy_market = new StockMarket();
dummy_market.addDummyBrokers();
dummy_market.addDummyStocks();

function saveMarket(){
 //   fs.writeFile('./json/market.json', JSON.stringify(market.toJSON(0)), (error)=>{
 //       logger.error(error);
 //   });
}

router.get('/market/:num([0-9]{1,})', (req, res, next)=>{
    const day = parseInt(req.params.num);
    logger.verbose(`Getting day ${day}`);
    res.send(JSON.stringify(market.toJSON(day)));
});

router.get('/market', (req, res, next)=>{
    logger.verbose(`Getting last day`);
    res.send(JSON.stringify(market.toJSON()));
})

router.delete('/stock/:num([0-9]{1,})', (req, res, next)=>{
    const id = parseInt(req.params.num);
    market.stocks.splice(id, 1);
    saveMarket();
    res.send({ok: true});
});

router.get('/market_info', (req, res, next)=>{
    res.send(JSON.stringify(dummy_market.toJSON()));
});

router.put('/stock', (req, res, next)=>{
    let stock = req.body;
    logger.verbose(`Put request stock ${stock.id} : ${stock.stock.name}`);
    stock.stock.params = stock.stock_params;
    market.update_stock(stock.stock, stock.id);
    saveMarket();
    res.send({ok: true});
});

router.put('/broker', (req, res, next)=>{
    let broker = req.body;
    market.update_broker(broker.broker, broker.id);
    saveMarket();
    res.send({ok: true});
});

router.delete('/broker/:num([0-9]{1,})', (req, res, next)=>{
    const id = parseInt(req.params.num);
    console.log(id);
    market.brokers.splice(id, 1);
    saveMarket();
    res.send({ok: true});
});

export {router as stock_router, market}