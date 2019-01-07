"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var winston = require("winston");
var enumerateErrorFormat = winston.format(function (info) {
    if (info instanceof Error) {
        // @ts-ignore
        return Object.assign({
            message: info.message,
            stack: info.stack
        }, info);
    }
    return info;
});
var logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(enumerateErrorFormat(), winston.format.colorize(), winston.format.timestamp({
                format: 'HH:mm:ss'
            }), winston.format.printf(function (info) {
                // @ts-ignore
                if (info.message instanceof Error) {
                    return info.timestamp + " " + info.level + ": " + info.message.name + " " + info.message.message + "\n" +
                        ("" + info.message.stack);
                }
                return info.timestamp + " " + info.level + ": " + info.message;
            }))
        }),
    ],
});
exports.logger = logger;
var logger_stream = {
    write: function (message, encoding) {
        logger.info(message.replace(/[\n]/g, ""));
    }
};
exports.logger_stream = logger_stream;
