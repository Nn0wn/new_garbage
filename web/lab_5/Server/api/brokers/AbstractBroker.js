"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractBroker = /** @class */ (function () {
    function AbstractBroker(money, name, market) {
        this._money = money;
        this._start_money = money;
        this._name = name;
        this._portfolio = [{}];
        this._market = market;
        this._market.add_broker(this);
    }
    AbstractBroker.prototype.get_portfolio = function (time) {
        if (this._portfolio.length > time) {
            return this._portfolio[time];
        }
        else
            return {};
    };
    AbstractBroker.prototype.make_a_day = function () {
        this._portfolio.push(this.makeDecision());
    };
    Object.defineProperty(AbstractBroker.prototype, "portfolio", {
        get: function () {
            return this._portfolio[this._portfolio.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractBroker.prototype, "copy_of_portfolio", {
        get: function () {
            var _this = this;
            var res = {};
            Object.keys(this.portfolio).forEach(function (stock_name) {
                res[stock_name] = {
                    quantity: _this.portfolio[stock_name].quantity,
                    stock: _this.portfolio[stock_name].stock
                };
            });
            return res;
        },
        enumerable: true,
        configurable: true
    });
    AbstractBroker.prototype.buy = function (quantity, stock) {
        if ((stock.price() * quantity <= this.money) && (stock.available_quantity >= quantity)) {
            this._money -= stock.price() * quantity;
            if (stock.name in this.portfolio) {
                this.portfolio[stock.name].quantity += quantity;
            }
            else {
                this.portfolio[stock.name] = { quantity: quantity, stock: stock };
            }
            stock.add_share(quantity);
            return true;
        }
        return false;
    };
    AbstractBroker.prototype.sell = function (quantity, stock) {
        if (this.portfolio[stock.name].quantity >= quantity) {
            this.portfolio[stock.name].quantity -= quantity;
            this._money += stock.price() * quantity;
            if (this.portfolio[stock.name].quantity === 0) {
                delete this.portfolio[stock.name];
            }
            stock.remove_share(quantity);
            return true;
        }
        return false;
    };
    AbstractBroker.prototype.toJSON = function (time) {
        if (time === void 0) { time = this._portfolio.length - 1; }
        var stocks = [];
        for (var _i = 0, _a = Object.keys(this.get_portfolio(time)); _i < _a.length; _i++) {
            var stock_name = _a[_i];
            stocks.push({
                name: this.get_portfolio(time)[stock_name].stock.name,
                quantity: this.get_portfolio(time)[stock_name].quantity
            });
        }
        return {
            name: this.name,
            type: this.type,
            money: this.get_money(time),
            money_in_stocks: this.get_money_in_stocks(time),
            total_money: this.total_money,
            stocks: stocks
        };
    };
    AbstractBroker.prototype.get_money_in_stocks = function (time) {
        var _this = this;
        var money_in_shares = 0;
        Object.keys(this.get_portfolio(time)).forEach(function (stock_name) {
            money_in_shares += _this.get_portfolio(time)[stock_name].quantity *
                _this.get_portfolio(time)[stock_name].stock.price(time);
        });
        return money_in_shares;
    };
    Object.defineProperty(AbstractBroker.prototype, "money_in_stocks", {
        get: function () {
            return this.get_money_in_stocks(this._portfolio.length - 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractBroker.prototype, "total_money", {
        get: function () {
            return this._start_money;
        },
        enumerable: true,
        configurable: true
    });
    AbstractBroker.prototype.get_money = function (time) {
        if (time === void 0) { time = this._portfolio.length - 1; }
        if (time === this._portfolio.length - 1)
            return this.money;
        return this.total_money - this.get_money_in_stocks(time);
    };
    Object.defineProperty(AbstractBroker.prototype, "money", {
        get: function () {
            return this._money;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractBroker.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractBroker.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractBroker;
}());
exports.AbstractBroker = AbstractBroker;
