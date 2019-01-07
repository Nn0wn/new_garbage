"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var StaticStock_1 = require("../api/stocks/StaticStock");
var BinomialStock_1 = require("../api/stocks/BinomialStock");
var UniformStock_1 = require("../api/stocks/UniformStock");
var BernoulliStock_1 = require("../api/stocks/BernoulliStock");
var StockMarket_1 = require("../api/StockMarket");
var AfkBroker_1 = require("../api/brokers/AfkBroker");
describe('Stocks', function () {
    it('Static & Abstract Stock', function () {
        var stock = new StaticStock_1.StaticStock(new StockMarket_1.StockMarket(), "TEST", 10, 10);
        chai_1.expect(stock.name).to.equal("TEST");
        chai_1.expect(stock.calculate_price(0)).to.equal(10);
        chai_1.expect(stock.price(0)).to.equal(10);
        chai_1.expect(stock.quantity).to.equal(10);
        chai_1.expect(stock.available_quantity).to.equal(10);
        for (var i = 0; i < 1000; i++) {
            chai_1.expect(stock.price(i)).to.equal(10);
        }
    });
    it('Stock time iteration test', function () {
        var stock = new StaticStock_1.StaticStock(new StockMarket_1.StockMarket(), "TEST", 10, 10);
    });
    it('toJSON', function () {
        var stock = new StaticStock_1.StaticStock(new StockMarket_1.StockMarket(), "TEST", 1, 10);
        var json = stock.toJSON();
        chai_1.expect(json).not.to.be.undefined;
        chai_1.expect(json.name).to.be.equal('TEST');
        chai_1.expect(json.start_price).to.be.equal(10);
        chai_1.expect(json.params).to.have.length(1);
        chai_1.expect(json.params[0]).to.be.deep.equal({
            name: 'value',
            text: 'Value',
            value: 10
        });
    });
    it('Binomial Stock', function () {
        var stock = new BinomialStock_1.BinomialStock(new StockMarket_1.StockMarket(), "TEST2", 1, 10, 2);
        var price = 0;
        for (var i = 0; i < 1000; i++) {
            price = stock.price(i);
            chai_1.expect(price).not.undefined;
            chai_1.expect(price).to.be.approximately(10, 2 * i);
        }
        chai_1.expect(price).to.be.equal(stock.price());
    });
    it('Uniform Stock', function () {
        var stock = new UniformStock_1.UniformStock(new StockMarket_1.StockMarket(), "TEST3", 1, 5, 0, 10);
        for (var i = 0; i < 1000; i++) {
            var price = stock.price(i);
            chai_1.expect(price).not.undefined;
            chai_1.expect(price).to.be.approximately(5, 5);
        }
    });
    it('Bernoulli Stock', function () {
        var stock = new BernoulliStock_1.BernoulliStock(new StockMarket_1.StockMarket(), "TEST4", 1, 1, 10);
        for (var i = 0; i < 1000; i++) {
            var price = stock.price(i);
            chai_1.expect(price).not.undefined;
            chai_1.expect(price === 1 || price == 10).to.be.true;
        }
    });
});
describe('Brokers', function () {
    it('Buy and sell test', function () {
        var broker = new AfkBroker_1.AfkBroker(1000, 'TEST', new StockMarket_1.StockMarket());
        var stock = new StaticStock_1.StaticStock(new StockMarket_1.StockMarket(), 'TEST', 1000, 10);
        chai_1.expect(broker.buy(40, stock)).to.be.true;
        chai_1.expect(broker.buy(61, stock)).to.be.false;
        chai_1.expect(broker.money).to.be.equal(1000 - 40 * 10);
        chai_1.expect(broker.money_in_stocks).to.be.equal(40 * 10);
        chai_1.expect(broker.total_money).to.be.equal(1000);
        chai_1.expect(broker.sell(40, stock)).to.be.true;
        chai_1.expect(broker.money).to.be.equal(1000);
        chai_1.expect(broker.money_in_stocks).to.be.equal(0);
    });
    it('Time iteration test', function () {
        var broker = new AfkBroker_1.AfkBroker(10000, 'TEST', new StockMarket_1.StockMarket());
        var stock = new StaticStock_1.StaticStock(new StockMarket_1.StockMarket(), 'TEST', 1000, 10);
        chai_1.expect(broker.portfolio).to.be.empty;
        broker.buy(40, stock);
        chai_1.expect(broker.portfolio).to.haveOwnProperty('TEST');
        broker.make_a_day();
        broker.buy(40, stock);
        chai_1.expect(broker.portfolio['TEST'].quantity).to.be.equal(80);
        broker.make_a_day();
        chai_1.expect(broker.portfolio['TEST'].quantity).to.be.equal(80);
        broker.make_a_day();
        broker.sell(70, stock);
        chai_1.expect(broker.portfolio['TEST'].quantity).to.be.equal(10);
        broker.make_a_day();
        broker.sell(10, stock);
        chai_1.expect(broker.portfolio).not.to.haveOwnProperty('TEST');
        chai_1.expect(broker.get_portfolio(0)['TEST'].quantity).to.be.equal(40);
        chai_1.expect(broker.get_portfolio(1)['TEST'].quantity).to.be.equal(80);
        chai_1.expect(broker.get_portfolio(2)['TEST'].quantity).to.be.equal(80);
        chai_1.expect(broker.get_portfolio(3)['TEST'].quantity).to.be.equal(10);
        chai_1.expect(broker.get_portfolio(4)).not.to.haveOwnProperty('TEST');
    });
});
describe('Stock market', function () {
    it('Dummy stocks', function () {
        var market = new StockMarket_1.StockMarket();
        var len = market.addDummyStocks();
        chai_1.expect(market.stocks).to.have.length(len);
    });
    it('Dummy brokers', function () {
        var market = new StockMarket_1.StockMarket();
        var len = market.addDummyBrokers();
        chai_1.expect(market.brokers).to.have.length(len);
    });
    it('to JSON', function () {
        var market = new StockMarket_1.StockMarket();
        var len = market.addDummyStocks();
        //@ts-ignore
        var stocks = market.toJSON()['stocks'];
        chai_1.expect(stocks).to.have.length(len);
        for (var i = 0; i < len; i++) {
            chai_1.expect(stocks[i]).to.ownProperty('params');
            chai_1.expect(stocks[i].params).to.have.length.above(0);
        }
    });
    it('ToJSON time iteration test', function () {
        var market = new StockMarket_1.StockMarket();
        var broker = new AfkBroker_1.AfkBroker(10000, 'TEST', market);
        var stock = new StaticStock_1.StaticStock(market, 'TEST', 1000, 10);
        market.simulate_to_time(1);
        broker.buy(100, stock);
        market.simulate_to_time(2);
        broker.buy(100, stock);
        market.simulate_to_time(3);
        broker.sell(50, stock);
        market.simulate_to_time(4);
        broker.sell(150, stock);
        var market_states = market.toJSON(0, 5);
        chai_1.expect(market_states[0].brokers[0].money).equal(10000);
        chai_1.expect(market_states[1].brokers[0].money).equal(9000);
        chai_1.expect(market_states[2].brokers[0].money).equal(8000);
        chai_1.expect(market_states[3].brokers[0].money).equal(8500);
        chai_1.expect(market_states[4].brokers[0].money).equal(10000);
        chai_1.expect(market_states[2].stocks[0].available_quantity).equal(800);
    });
});
