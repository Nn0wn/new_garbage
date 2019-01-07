"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractStock_1 = require("./AbstractStock");
var Math_1 = require("../Math");
var BernoulliStock = /** @class */ (function (_super) {
    __extends(BernoulliStock, _super);
    function BernoulliStock(market, name, quantity, start_price, second_price) {
        var _this = _super.call(this, market, name, quantity, start_price) || this;
        _this._type = "Bernoulli";
        _this._first_price = start_price;
        _this._second_price = second_price;
        _this.add_param('first_price', 'First price', function () { return _this._first_price; }, function (new_value) { _this._first_price = new_value; });
        _this.add_param('second_price', 'Second price', function () { return _this._second_price; }, function () { return function (new_value) { _this._second_price = new_value; }; });
        return _this;
    }
    BernoulliStock.prototype.calculate_price = function (time) {
        if (Math_1.getRandomInt(1) == 1) {
            return this._first_price;
        }
        else
            return this._second_price;
    };
    Object.defineProperty(BernoulliStock.prototype, "first_price", {
        get: function () {
            return this._first_price;
        },
        set: function (value) {
            this._first_price = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BernoulliStock.prototype, "second_price", {
        get: function () {
            return this._second_price;
        },
        set: function (value) {
            this._second_price = value;
        },
        enumerable: true,
        configurable: true
    });
    return BernoulliStock;
}(AbstractStock_1.AbstractStock));
exports.BernoulliStock = BernoulliStock;
