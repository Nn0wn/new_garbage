import { Injectable } from '@angular/core';
import * as $ from 'jquery';

export interface Stock {
    dynamic_percent_text: string;
    dynamic_text: string;
    name: string;
    type: string;
    start_price: number;
    dynamic: number;
    price: number;
    available_quantity: number;
    quantity: number;
    params: {
        name: string,
        text: string,
        value: number
    }[];
}

export interface Broker {
    name: string;
    money: number;
    type: string;
    money_in_stocks: number;
    total_money: number;
    stocks: Stock[];
}

export interface Market {
    stocks: Stock[];
    brokers: Broker[];
}

@Injectable({
    providedIn: 'root'
})
export class MarketService {
    constructor() {
        this._day = 0;
        this._max_day = 0;
    }
    private last_market: Market;
    private market_info: Market;
    private last_market_day: number;
    private _max_day: number;
    private _day: number;
    private _update_callback: ((new_market: Market) => void);

    static getStockPercentDynamicText(stock: Stock): string {
        if (stock.dynamic > 0) {
            return `+${Math.trunc (stock.dynamic / stock.price * 100)}%`;
        }
        return `${Math.trunc (stock.dynamic / stock.price * 100)}%`;
    }

    static getStockDynamicText(stock: Stock): string {
        if (stock.dynamic > 0) {
            return `+${stock.dynamic}`;
        }
        return `${stock.dynamic}`;
    }

    async getMarket(day: number = this._day) {
        console.log(`Getting market ${day}`);
        if ((this.last_market_day === day) && (this.last_market)) {
            console.log(`Getting last market ${day}`);
            return this.last_market;
        }
        let _market: Market;
        await $.ajax({
                url: `http://localhost:3000/market/${day}`,
                method: 'GET',
                crossDomain: true,
            }
        ).then(function (market)  {
            _market = JSON.parse(market);
        });
        _market.stocks.forEach((stock) => {
            stock.dynamic_text = MarketService.getStockDynamicText(stock);
            stock.dynamic_percent_text = MarketService.getStockPercentDynamicText(stock);
        });
        this.last_market = _market;
        return _market;
    }

    async getMarketInfo() {
        if (this.market_info) {
            return this.market_info;
        }
        let _market: Market;
        await $.ajax({
                url: `http://localhost:3000/market_info`,
                method: 'GET',
                crossDomain: true,
            }
        ).then(function (market)  {
            _market = JSON.parse(market);
        });
        this.market_info = _market;
        return _market;
    }

    commit_stock_change(stock, market) {
        let i: number;
        for (i = 0; i < market.stocks.length; i++) {
            if (stock.name === market.stocks[i].name) {
                break;
            }
        }
        const obj = {
            stock: stock,
            stock_params: stock.params,
            id: i
        };
        $.ajax({
            url: 'http://localhost:3000/stock',
            method: 'PUT',
            crossDomain: true,
            data: obj
        }).then(async (res) => {
            const _market = await this.getMarket();
            this.call_update(_market);
        });
    }

    commit_broker_change(broker, market) {
        let i: number;
        for (i = 0; i < market.brokers.length; i++) {
            if (broker.name === market.brokers[i].name) {
                break;
            }
        }
        const obj = {
            broker: broker,
            id: i
        };
        $.ajax({
            url: 'http://localhost:3000/broker',
            method: 'PUT',
            crossDomain: true,
            data: obj
        }).then(async (res) => {
            const _market = await this.getMarket();
            this.call_update(_market);
        });
    }

    delete_stock(stock, market) {
        let i: number;
        for (i = 0; i < market.stocks.length; i++) {
            if (stock.name === market.stocks[i].name) {
                break;
            }
        }
        $.ajax({
            url: `http://localhost:3000/stock/${i}`,
            method: 'DELETE',
            crossDomain: true,
        }).then(async (res) => {
            const _market = await this.getMarket();
            this.call_update(_market);
        });
    }

    delete_broker(broker, market) {
        let i: number;
        for (i = 0; i < market.brokers.length; i++) {
            if (broker.name === market.brokers[i].name) {
                break;
            }
        }
        $.ajax({
            url: `http://localhost:3000/broker/${i}`,
            method: 'DELETE',
            crossDomain: true
        }).then(async (res) => {
            const _market = await this.getMarket();
            this.call_update(_market);
        });
    }

    check_stocks_unique_names(stock, market): boolean {
        let unique_names = true;
        for (let i = 0; i < market.stocks.length; i++) {
            unique_names = unique_names && (stock.name !== market.stocks[i].name ||
                stock === market.stocks[i]);
        }
        return unique_names;
    }

    check_broker_unique_names(broker, market): boolean {
        let unique_names = true;
        for (let i = 0; i < market.brokers.length; i++) {
            unique_names = unique_names && (broker.name !== market.brokers[i].name ||
                broker === market.brokers[i]);
        }
        return unique_names;
    }

    get is_editable() {
        return this._day === this._max_day;
    }

    async forward() {
        await this.go_to_day(++this._day);
    }

    async back() {
        await this.go_to_day(--this._day);
    }

    async go_to_day(day: number = this._day) {
        console.log(`Going to ${day}`);
        if (day < 0) {
            day = 0;
            return;
        }
        if (day > this._max_day) {
            this._max_day = day;
        }
        this._day = day;
        const new_market = await this.getMarket();
        console.log('Starting callback');
        this.call_update(new_market);
        console.log(`Gone`);
    }

    get max_day(): number {
        return this._max_day;
    }

    get day(): number {
        return this._day;
    }
    set update_callback(value) {
        this._update_callback = value;
    }
    private call_update(new_market: Market) {
        this._update_callback(new_market);
    }
}
