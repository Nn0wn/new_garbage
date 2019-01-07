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
var UniformStock = /** @class */ (function (_super) {
    __extends(UniformStock, _super);
    function UniformStock(market, name, quantity, start_price, min_price, max_price) {
        var _this = _super.call(this, market, name, quantity, start_price) || this;
        _this._type = 'Uniform';
        _this._min_price = min_price;
        _this._max_price = max_price;
        _this.add_param('first_price', 'First price', function () { return _this._min_price; }, function (new_value) { _this._min_price = new_value; });
        _this.add_param('second_price', 'Second price', function () { return _this._max_price; }, function (new_value) { _this._max_price = new_value; });
        return _this;
    }
    UniformStock.prototype.calculate_price = function (time) {
        return Math_1.getRandomRangeInt(this._min_price, this._max_price);
    };
    Object.defineProperty(UniformStock.prototype, "min_price", {
        get: function () {
            return this._min_price;
        },
        set: function (value) {
            this._min_price = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UniformStock.prototype, "max_price", {
        get: function () {
            return this._max_price;
        },
        set: function (value) {
            this._max_price = value;
        },
        enumerable: true,
        configurable: true
    });
    return UniformStock;
}(AbstractStock_1.AbstractStock));
exports.UniformStock = UniformStock;
