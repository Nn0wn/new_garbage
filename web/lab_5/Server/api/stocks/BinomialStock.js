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
var BinomialStock = /** @class */ (function (_super) {
    __extends(BinomialStock, _super);
    function BinomialStock(market, name, quantity, start_price, variation) {
        if (variation === void 0) { variation = 1; }
        var _this = _super.call(this, market, name, quantity, start_price) || this;
        _this._variation = variation;
        _this._type = 'Binomial';
        _this.add_param('variation', 'Variation', function () { return _this._variation; }, function (new_value) { _this._variation = new_value; });
        return _this;
    }
    BinomialStock.prototype.calculate_price = function (time) {
        return this.price(time - 1) + Math_1.getRandomInt(this._variation) * (Math_1.getRandomInt(1) * 2 - 1);
    };
    Object.defineProperty(BinomialStock.prototype, "variation", {
        get: function () {
            return this._variation;
        },
        set: function (value) {
            this._variation = value;
        },
        enumerable: true,
        configurable: true
    });
    return BinomialStock;
}(AbstractStock_1.AbstractStock));
exports.BinomialStock = BinomialStock;
