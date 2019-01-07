"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket = __importStar(require("socket.io"));
var winston_1 = require("./winston");
var SocketController = /** @class */ (function () {
    function SocketController(server, market) {
        this.io = socket.listen(server);
        this.io.on('connection', this.sockets.bind(this));
        this.clients = [];
        winston_1.logger.verbose('Socket server online');
        this.market = market;
        this.timerId = null;
    }
    SocketController.prototype.sockets = function (socket) {
        var _this = this;
        this.clients.push(socket);
        socket.on('connected', function (msg) {
            socket.name = msg.name;
            winston_1.logger.verbose(socket.name + " connected");
            _this.market.set_online(msg.name, true);
        });
        this.market.on_update_callback = function () {
            winston_1.logger.verbose('Sendind update signal');
            socket.json.emit('market_update');
            socket.json.broadcast.emit('market_update');
        };
        socket.on('disconnect', function () {
            winston_1.logger.verbose(socket.name + " disconnected");
            _this.market.set_online(socket.name, false);
            var i = _this.clients.indexOf(socket);
            _this.clients.splice(i, 1);
        });
        socket.on('start_market', function (msg) {
            _this.startMarket(msg.interval);
        });
        socket.on('stop_market', function (msg) {
            _this.stopMarket();
        });
        socket.on('reset_market', function (msg) {
            _this.resetMarket();
        });
        socket.on('buy_deal', function (msg) {
            winston_1.logger.verbose(msg.broker_name + " buys " + msg.quantity + " of " + msg.stock_name);
            _this.market.processBuyDeal(msg.stock_name, msg.broker_name, parseInt(msg.quantity));
        });
        socket.on('sell_deal', function (msg) {
            winston_1.logger.verbose(msg.broker_name + " sells " + msg.quantity + " of " + msg.stock_name);
            _this.market.processSellDeal(msg.stock_name, msg.broker_name, parseInt(msg.quantity));
        });
    };
    SocketController.prototype.resetMarket = function () {
        winston_1.logger.verbose('Reset market received');
        clearInterval(this.timerId);
        this.market.reset();
    };
    SocketController.prototype.stopMarket = function () {
        winston_1.logger.verbose('Stop market received');
        clearInterval(this.timerId);
    };
    SocketController.prototype.startMarket = function (interval) {
        var _this = this;
        winston_1.logger.verbose('Start market received');
        this.timerId = setInterval(function () {
            winston_1.logger.verbose('Updating market');
            _this.market.simulate_one_day();
        }, interval * 1000);
    };
    return SocketController;
}());
exports.SocketController = SocketController;
