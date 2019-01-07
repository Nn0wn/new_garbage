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
var AbstractBroker_1 = require("./AbstractBroker");
var AfkBroker = /** @class */ (function (_super) {
    __extends(AfkBroker, _super);
    function AfkBroker(money, name, market) {
        var _this = _super.call(this, money, name, market) || this;
        _this._type = 'Afk';
        return _this;
    }
    AfkBroker.prototype.makeDecision = function () {
        return this.copy_of_portfolio;
    };
    return AfkBroker;
}(AbstractBroker_1.AbstractBroker));
exports.AfkBroker = AfkBroker;
