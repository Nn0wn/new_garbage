import * as socket from 'socket.io';
import { logger } from "./winston";
import { StockMarket } from './api/StockMarket';

export class SocketController {
    constructor(server: any, market: StockMarket) {
        this.io = socket.listen(server);
        this.io.on('connection', this.sockets.bind(this))
        this.clients = []
        logger.verbose('Socket server online');
        this.market = market;
        this.timerId = null;
    }

    sockets(socket: any) {
        this.clients.push(socket);
        socket.on('connected', (msg: any) => {
            socket.name = msg.name;
            logger.verbose(`${socket.name} connected`);
            this.market.set_online(msg.name, true);
        })
        
        this.market.on_update_callback = () =>{
            logger.verbose('Sendind update signal');
            socket.json.emit('market_update');
            socket.json.broadcast.emit('market_update');
        }

        socket.on('disconnect', () => {
            logger.verbose(`${socket.name} disconnected`);
            this.market.set_online(socket.name, false);
            let i = this.clients.indexOf(socket);
            this.clients.splice(i, 1);
        })

        socket.on('start_market', (msg: any)=>{
            this.startMarket(msg.interval);
        })

        socket.on('stop_market', (msg: any)=>{
            this.stopMarket();
        })

        socket.on('reset_market', (msg: any)=>{
            this.resetMarket();
        })
        socket.on('buy_deal', (msg: any)=>{
            logger.verbose(`${msg.broker_name} buys ${msg.quantity} of ${msg.stock_name}`);
            this.market.processBuyDeal(msg.stock_name, msg.broker_name, parseInt(msg.quantity));
        })
        socket.on('sell_deal', (msg: any)=>{
            logger.verbose(`${msg.broker_name} sells ${msg.quantity} of ${msg.stock_name}`);
            this.market.processSellDeal(msg.stock_name, msg.broker_name, parseInt(msg.quantity));
        })
    }

    private io: socket.Server
    private clients: any[]
    private market: StockMarket
    private timerId: any;

    private resetMarket(): any {
        logger.verbose('Reset market received');
        clearInterval(this.timerId);
        this.market.reset();
    }

    private stopMarket(): any {
        logger.verbose('Stop market received');
        clearInterval(this.timerId);
    }

    private startMarket(interval: number): any {
        logger.verbose('Start market received');
        this.timerId = setInterval(()=>{
            logger.verbose('Updating market');
            this.market.simulate_one_day();
        }, interval*1000);
    }
}