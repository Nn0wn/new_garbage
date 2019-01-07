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
var winston_1 = require("../../winston");
var StaticStock = /** @class */ (function (_super) {
    __extends(StaticStock, _super);
    function StaticStock(market, name, quantity, start_price) {
        var _this = _super.call(this, market, name, quantity, start_price) || this;
        _this._type = 'Static';
        _this.add_param("value", "Value", function () { return _this.values[0]; }, function (new_value) { _this.values[0] = new_value; });
        return _this;
    }
    StaticStock.prototype.calculate_price = function (time) {
        winston_1.logger.info("Static stock: calculating price " + time + ". Values number: " + this.values.length);
        return this.values[0];
    };
    return StaticStock;
}(AbstractStock_1.AbstractStock));
exports.StaticStock = StaticStock;
