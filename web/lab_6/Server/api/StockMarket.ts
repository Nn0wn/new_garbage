import {AbstractStock} from "./stocks/AbstractStock";
import {StaticStock} from "./stocks/StaticStock";
import {BinomialStock} from "./stocks/BinomialStock";
import {UniformStock} from "./stocks/UniformStock";
import {BernoulliStock} from "./stocks/BernoulliStock";
import {AbstractBroker} from "./brokers/AbstractBroker";
import {AfkBroker} from "./brokers/AfkBroker";
import {logger} from "../winston";

export class StockMarket{
    constructor(){
        this._time = 0;
        this._stocks = [];
        this._brokers = [];
    }

    add_stock(stock: AbstractStock){
        this._stocks.push(stock)
        this.callback();
    }

    add_broker(broker: AbstractBroker){
        this._brokers.push(broker)
        this.callback();
    }

    fromJSON(obj: any){
        this._stocks = [];
        this._brokers = [];
        obj.stocks.forEach((stock_info: any)=>{
            this.update_stock(stock_info);
        });
        obj.brokers.forEach((broker_info: any)=>{
            this.update_broker(broker_info);
        })
        this.callback();
    }

    toJSON(start_time: number = this.time, end_time?: number): object {
        if (end_time !== undefined){
            let res = [];
            for (let i: number = start_time; i <= end_time; i++){
                res.push(this.toJSON(i))
            }
            return res;
        }
        end_time = start_time;
        if (end_time > this.time)
            this.simulate_to_time(end_time);
        let stocks = [];
        for (let i: number = 0; i < this._stocks.length; i++){
            stocks.push(this._stocks[i].toJSON(end_time));
        }
        let brokers = [];
        for (let i: number = 0; i < this._brokers.length; i++){
            brokers.push(this._brokers[i].toJSON(end_time))
        }
        return {
            stocks: stocks,
            brokers: brokers,
        };
    }

    simulate_one_day(){
        this.simulate_to_time(this._time+1);
    }

    simulate_to_time(new_time: number){
        logger.info(`Simulating from time ${this._time} to time: ${new_time} `);
        for(let i: number = this._time + 1; i <= new_time; i++){
            this._stocks.forEach((stock:AbstractStock)=>{
                stock.price(i);
            })
        }
        for (let i: number = this._time + 1; i <= new_time; i++){
            this._brokers.forEach((broker: AbstractBroker)=>{
                broker.make_a_day();
            });
        }
        this._time = new_time;
        this.callback();
    }

    reset(){
        this._time = 0;
        this._brokers.forEach((broker)=>{
            broker.reset();
        })
        this._stocks.forEach((stock)=>{
            stock.reset();
        })
        this.callback();
    }

    update_stock(stock: any, id: number = this._stocks.length){
        if (this._stocks.length <= id){
            this.generate_stock(stock, id);
        }
        else if (this._stocks[id].type != stock.type){
            this.generate_stock(stock, id);
        }
        else{
            this.set_stock(stock, id);
        }
        this.callback();
    }

    private generate_stock(stock_info: any, id: number){
        stock_info.start_price = parseInt(stock_info.start_price);
        stock_info.quantity = parseInt(stock_info.quantity);
        for (let i = 0; i < stock_info.params.length; i++){
            stock_info.params[i].value = parseInt(stock_info.params[i].value);
        }
        let new_stock: AbstractStock;
        switch (stock_info.type) {
            case 'Static':
                new StaticStock(this, stock_info.name, stock_info.quantity,
                    stock_info.start_price);
                break;
            case 'Binomial':
                new BinomialStock(this, stock_info.name, stock_info.quantity,
                    stock_info.start_price, stock_info.params[0].value);
                break;
            case 'Uniform':
                new UniformStock(this, stock_info.name, stock_info.quantity,
                    stock_info.start_price, stock_info.params[0].value, stock_info.params[1].value);
                break;
            case 'Bernoulli':
                new BernoulliStock(this, stock_info.name, stock_info.quantity,
                    stock_info.start_price, stock_info.params[1].value);
                break;
        }
        //TODO
    }

    private set_stock(stock_info: any, id: number){
        let stock_to_update = this._stocks[id];
        stock_to_update.name = stock_info.name;
        stock_to_update.quantity = parseInt(stock_info.quantity);
        stock_info.params.forEach((param_info: any)=>{
            stock_to_update.params[param_info.name].setter(parseInt(param_info.value));
        })
    }

    update_broker(broker: any, id: number = this._brokers.length){
        if (this._brokers.length <=id){
            this.generate_broker(broker, id);
        }
        else if (this._brokers[id].type != broker.type){
            this.generate_broker(broker, id);
        }
        else {
            this.set_broker(broker, id);
        }
        this.callback();
    }

    private generate_broker(broker_info: any, id: number){
        broker_info.money = parseInt(broker_info.money);
        switch (broker_info.type) {
            case 'Afk':
                new AfkBroker(broker_info.money, broker_info.name, this);
        }
        let broker = this._brokers[id];
        let portfolio: {name: string, quantity: number, stock: AbstractStock}[] = [];
        broker_info.stocks.forEach((stock: any)=>{
            portfolio.push({
                name: stock.name,
                quantity: stock.quantity,
                stock: this.get_stock_by_name(stock.name)
            })
        });
        if (portfolio.length > 0){
            broker.set_portfolio(portfolio)
        }
    }

    private set_broker(broker_info: any, id: number){
        let broker_to_update = this._brokers[id];
        broker_to_update.name = broker_info.name;
    }

    addDummyStocks(){
        new StaticStock(this,"Static Stock",1000, 10);
        new BinomialStock(this,"Binomial Stock",1000, 10, 2);
        new UniformStock(this,"Uniform Stock",1000, 5, 0, 10);
        new BernoulliStock(this,"Bernoulli Stock",1000, 1, 10);
        this.callback();
        return this._stocks.length;
    }

    addDummyBrokers(){
        new AfkBroker(100,"Afk Broker", this);
        this.callback();
        return this._brokers.length;
    }

    processBuyDeal(stock_name: string, broker_name: string, quantity: number){
        let stock = this.get_stock_by_name(stock_name);
        let broker = this.get_broker_by_name(broker_name);
        broker.buy(quantity, stock);
        this.callback();
    }

    processSellDeal(stock_name: string, broker_name: string, quantity: number){
        let stock = this.get_stock_by_name(stock_name);
        let broker = this.get_broker_by_name(broker_name);
        broker.sell(quantity, stock);
        this.callback();
    }

    get stocks(): AbstractStock[] {
        return this._stocks;
    }

    get_stock_by_name(name: string): AbstractStock{
        let i: number;
        for (i = 0; i < this._stocks.length; i++){
            if (this._stocks[i].name === name)
                return this._stocks[i];
        }
        return this._stocks[i];
    }

    get_broker_by_name(name: string): AbstractBroker{
        let i: number;
        for (i = 0; i < this._brokers.length; i++){
            if (this._brokers[i].name === name)
                return this.brokers[i];
        }
        return this._brokers[i];
    }

    set_online(name: string, online: boolean){
        let broker: AbstractBroker = this.get_broker_by_name(name);
        if (broker){
            logger.verbose(`Setting online: ${online} for ${broker.name}`);
            broker.online = online;
        }
        this.callback();
    }

    get brokers(): AbstractBroker[] {
        return this._brokers;
    }

    get time(): number {
        return this._time;
    }

    set on_update_callback(callback: any){
        this._on_update_callback = callback;
    }

    private callback(){
        if (this._on_update_callback){
            this._on_update_callback();
        }
    }

    private _on_update_callback: any;
    private _time: number;
    private _brokers: AbstractBroker[];
    private _stocks: AbstractStock[]
}