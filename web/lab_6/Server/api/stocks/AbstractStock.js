"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractStock = /** @class */ (function () {
    function AbstractStock(market, name, quantity, start_price) {
        this._name = name;
        this._quantity = quantity;
        this._available_quantity = [quantity];
        this.values = [];
        this.values[0] = start_price;
        this._params = {};
        this._market = market;
        this._market.add_stock(this);
        this._type = '';
    }
    Object.defineProperty(AbstractStock.prototype, "quantity", {
        get: function () {
            return this._quantity;
        },
        set: function (value) {
            this._quantity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractStock.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    AbstractStock.prototype.price = function (time) {
        if (time === void 0) { time = this.values.length - 1; }
        if (this.values.length <= time) {
            for (var i = this.values.length; i <= time; i++) {
                this.values.push(this.calculate_price(i));
                this._available_quantity.push(this.available_quantity);
            }
        }
        return this.values[time];
    };
    AbstractStock.prototype.add_share = function (quantity) {
        if (quantity <= this.available_quantity)
            this.available_quantity -= quantity;
    };
    AbstractStock.prototype.remove_share = function (quantity) {
        if (quantity + this.available_quantity <= this.quantity)
            this.available_quantity += quantity;
    };
    AbstractStock.prototype.toJSON = function (time) {
        if (time === void 0) { time = this.values.length - 1; }
        var _dynamic = 0;
        if (time != 0)
            _dynamic = this.price(time) - this.price(time - 1);
        return {
            name: this.name,
            type: this.type,
            start_price: this.values[0],
            dynamic: _dynamic,
            price: this.price(time),
            available_quantity: this.get_available_quantity(time),
            quantity: this.quantity,
            params: this.params_toJSON()
        };
    };
    AbstractStock.prototype.params_toJSON = function () {
        var res = [];
        for (var _i = 0, _a = Object.keys(this._params); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var param = this._params[name_1];
            res.push({
                name: name_1,
                text: param.text,
                value: param.getter()
            });
        }
        return res;
    };
    AbstractStock.prototype.add_param = function (name, text, getter, setter) {
        if (!(name in this._params))
            this._params[name] = { text: text, getter: getter, setter: setter };
    };
    AbstractStock.prototype.reset = function () {
        this._available_quantity = [this._available_quantity[0]];
        this.values = [this.values[0]];
    };
    Object.defineProperty(AbstractStock.prototype, "params", {
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractStock.prototype, "available_quantity", {
        get: function () {
            return this.get_available_quantity(this._available_quantity.length - 1);
        },
        set: function (value) {
            this._available_quantity[this._available_quantity.length - 1] = value;
        },
        enumerable: true,
        configurable: true
    });
    AbstractStock.prototype.get_available_quantity = function (time) {
        return this._available_quantity[time];
    };
    Object.defineProperty(AbstractStock.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractStock;
}());
exports.AbstractStock = AbstractStock;
