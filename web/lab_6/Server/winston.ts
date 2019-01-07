// @ts-ignore
import * as winston from "winston"

const enumerateErrorFormat = winston.format(info => {
    if (info instanceof Error) {
        // @ts-ignore
        return Object.assign({
            message: info.message,
            stack: info.stack
        }, info);
    }
    return info;
});

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ //Вывод в консоль
            level: 'debug', // Уровень debug или выше
            format: winston.format.combine(
                enumerateErrorFormat(),
                winston.format.colorize(),
                winston.format.timestamp({
                    format: 'HH:mm:ss'
                }),
                winston.format.printf(info => {
                    // @ts-ignore
                    if (info.message instanceof Error){
                        return `${info.timestamp} ${info.level}: ${info.message.name} ${info.message.message}\n` +
                            `${info.message.stack}`
                    }
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                })
            )
        }),
    ],
});

const logger_stream = {
    write: function (message: any, encoding: any){
        logger.info(message.replace(/[\n]/g, ""));
    }
};


export {logger, logger_stream}