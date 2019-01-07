"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StaticStock_1 = require("./stocks/StaticStock");
var BinomialStock_1 = require("./stocks/BinomialStock");
var UniformStock_1 = require("./stocks/UniformStock");
var BernoulliStock_1 = require("./stocks/BernoulliStock");
var AfkBroker_1 = require("./brokers/AfkBroker");
var winston_1 = require("../winston");
var StockMarket = /** @class */ (function () {
    function StockMarket() {
        this._time = 0;
        this._stocks = [];
        this._brokers = [];
    }
    StockMarket.prototype.add_stock = function (stock) {
        this._stocks.push(stock);
        this.callback();
    };
    StockMarket.prototype.add_broker = function (broker) {
        this._brokers.push(broker);
        this.callback();
    };
    StockMarket.prototype.fromJSON = function (obj) {
        var _this = this;
        this._stocks = [];
        this._brokers = [];
        obj.stocks.forEach(function (stock_info) {
            _this.update_stock(stock_info);
        });
        obj.brokers.forEach(function (broker_info) {
            _this.update_broker(broker_info);
        });
        this.callback();
    };
    StockMarket.prototype.toJSON = function (start_time, end_time) {
        if (start_time === void 0) { start_time = this.time; }
        if (end_time !== undefined) {
            var res = [];
            for (var i = start_time; i <= end_time; i++) {
                res.push(this.toJSON(i));
            }
            return res;
        }
        end_time = start_time;
        if (end_time > this.time)
            this.simulate_to_time(end_time);
        var stocks = [];
        for (var i = 0; i < this._stocks.length; i++) {
            stocks.push(this._stocks[i].toJSON(end_time));
        }
        var brokers = [];
        for (var i = 0; i < this._brokers.length; i++) {
            brokers.push(this._brokers[i].toJSON(end_time));
        }
        return {
            stocks: stocks,
            brokers: brokers,
        };
    };
    StockMarket.prototype.simulate_one_day = function () {
        this.simulate_to_time(this._time + 1);
    };
    StockMarket.prototype.simulate_to_time = function (new_time) {
        winston_1.logger.info("Simulating from time " + this._time + " to time: " + new_time + " ");
        var _loop_1 = function (i) {
            this_1._stocks.forEach(function (stock) {
                stock.price(i);
            });
        };
        var this_1 = this;
        for (var i = this._time + 1; i <= new_time; i++) {
            _loop_1(i);
        }
        for (var i = this._time + 1; i <= new_time; i++) {
            this._brokers.forEach(function (broker) {
                broker.make_a_day();
            });
        }
        this._time = new_time;
        this.callback();
    };
    StockMarket.prototype.reset = function () {
        this._time = 0;
        this._brokers.forEach(function (broker) {
            broker.reset();
        });
        this._stocks.forEach(function (stock) {
            stock.reset();
        });
        this.callback();
    };
    StockMarket.prototype.update_stock = function (stock, id) {
        if (id === void 0) { id = this._stocks.length; }
        if (this._stocks.length <= id) {
            this.generate_stock(stock, id);
        }
        else if (this._stocks[id].type != stock.type) {
            this.generate_stock(stock, id);
        }
        else {
            this.set_stock(stock, id);
        }
        this.callback();
    };
    StockMarket.prototype.generate_stock = function (stock_info, id) {
        stock_info.start_price = parseInt(stock_info.start_price);
        stock_info.quantity = parseInt(stock_info.quantity);
        for (var i = 0; i < stock_info.params.length; i++) {
            stock_info.params[i].value = parseInt(stock_info.params[i].value);
        }
        var new_stock;
        switch (stock_info.type) {
            case 'Static':
                new StaticStock_1.StaticStock(this, stock_info.name, stock_info.quantity, stock_info.start_price);
                break;
            case 'Binomial':
                new BinomialStock_1.BinomialStock(this, stock_info.name, stock_info.quantity, stock_info.start_price, stock_info.params[0].value);
                break;
            case 'Uniform':
                new UniformStock_1.UniformStock(this, stock_info.name, stock_info.quantity, stock_info.start_price, stock_info.params[0].value, stock_info.params[1].value);
                break;
            case 'Bernoulli':
                new BernoulliStock_1.BernoulliStock(this, stock_info.name, stock_info.quantity, stock_info.start_price, stock_info.params[1].value);
                break;
        }
        //TODO
    };
    StockMarket.prototype.set_stock = function (stock_info, id) {
        var stock_to_update = this._stocks[id];
        stock_to_update.name = stock_info.name;
        stock_to_update.quantity = parseInt(stock_info.quantity);
        stock_info.params.forEach(function (param_info) {
            stock_to_update.params[param_info.name].setter(parseInt(param_info.value));
        });
    };
    StockMarket.prototype.update_broker = function (broker, id) {
        if (id === void 0) { id = this._brokers.length; }
        if (this._brokers.length <= id) {
            this.generate_broker(broker, id);
        }
        else if (this._brokers[id].type != broker.type) {
            this.generate_broker(broker, id);
        }
        else {
            this.set_broker(broker, id);
        }
        this.callback();
    };
    StockMarket.prototype.generate_broker = function (broker_info, id) {
        var _this = this;
        broker_info.money = parseInt(broker_info.money);
        switch (broker_info.type) {
            case 'Afk':
                new AfkBroker_1.AfkBroker(broker_info.money, broker_info.name, this);
        }
        var broker = this._brokers[id];
        var portfolio = [];
        broker_info.stocks.forEach(function (stock) {
            portfolio.push({
                name: stock.name,
                quantity: stock.quantity,
                stock: _this.get_stock_by_name(stock.name)
            });
        });
        if (portfolio.length > 0) {
            broker.set_portfolio(portfolio);
        }
    };
    StockMarket.prototype.set_broker = function (broker_info, id) {
        var broker_to_update = this._brokers[id];
        broker_to_update.name = broker_info.name;
    };
    StockMarket.prototype.addDummyStocks = function () {
        new StaticStock_1.StaticStock(this, "Static Stock", 1000, 10);
        new BinomialStock_1.BinomialStock(this, "Binomial Stock", 1000, 10, 2);
        new UniformStock_1.UniformStock(this, "Uniform Stock", 1000, 5, 0, 10);
        new BernoulliStock_1.BernoulliStock(this, "Bernoulli Stock", 1000, 1, 10);
        this.callback();
        return this._stocks.length;
    };
    StockMarket.prototype.addDummyBrokers = function () {
        new AfkBroker_1.AfkBroker(100, "Afk Broker", this);
        this.callback();
        return this._brokers.length;
    };
    StockMarket.prototype.processBuyDeal = function (stock_name, broker_name, quantity) {
        var stock = this.get_stock_by_name(stock_name);
        var broker = this.get_broker_by_name(broker_name);
        broker.buy(quantity, stock);
        this.callback();
    };
    StockMarket.prototype.processSellDeal = function (stock_name, broker_name, quantity) {
        var stock = this.get_stock_by_name(stock_name);
        var broker = this.get_broker_by_name(broker_name);
        broker.sell(quantity, stock);
        this.callback();
    };
    Object.defineProperty(StockMarket.prototype, "stocks", {
        get: function () {
            return this._stocks;
        },
        enumerable: true,
        configurable: true
    });
    StockMarket.prototype.get_stock_by_name = function (name) {
        var i;
        for (i = 0; i < this._stocks.length; i++) {
            if (this._stocks[i].name === name)
                return this._stocks[i];
        }
        return this._stocks[i];
    };
    StockMarket.prototype.get_broker_by_name = function (name) {
        var i;
        for (i = 0; i < this._brokers.length; i++) {
            if (this._brokers[i].name === name)
                return this.brokers[i];
        }
        return this._brokers[i];
    };
    StockMarket.prototype.set_online = function (name, online) {
        var broker = this.get_broker_by_name(name);
        if (broker) {
            winston_1.logger.verbose("Setting online: " + online + " for " + broker.name);
            broker.online = online;
        }
        this.callback();
    };
    Object.defineProperty(StockMarket.prototype, "brokers", {
        get: function () {
            return this._brokers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockMarket.prototype, "time", {
        get: function () {
            return this._time;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StockMarket.prototype, "on_update_callback", {
        set: function (callback) {
            this._on_update_callback = callback;
        },
        enumerable: true,
        configurable: true
    });
    StockMarket.prototype.callback = function () {
        if (this._on_update_callback) {
            this._on_update_callback();
        }
    };
    return StockMarket;
}());
exports.StockMarket = StockMarket;
