import { expect } from 'chai'
import { AbstractStock } from '../api/stocks/AbstractStock'
import { StaticStock } from "../api/stocks/StaticStock";
import { BinomialStock } from "../api/stocks/BinomialStock";
import { UniformStock } from "../api/stocks/UniformStock";
import {BernoulliStock} from "../api/stocks/BernoulliStock";
import {StockMarket} from "../api/StockMarket";
import {AfkBroker} from "../api/brokers/AfkBroker";

describe('Stocks', ()=>{
    it('Static & Abstract Stock', ()=>{
        let stock: AbstractStock = new StaticStock(new StockMarket(),"TEST", 10, 10);
        expect(stock.name).to.equal("TEST");
        expect(stock.calculate_price(0)).to.equal(10);
        expect(stock.price(0)).to.equal(10);
        expect(stock.quantity).to.equal(10);
        expect(stock.available_quantity).to.equal(10);
        for (let i: number = 0; i < 1000; i++){
            expect(stock.price(i)).to.equal(10);
        }
    });
    it('Stock time iteration test', ()=>{
        let stock: AbstractStock = new StaticStock(new StockMarket(),"TEST", 10, 10);

    });
    it('toJSON', ()=>{
        let stock: AbstractStock = new StaticStock(new StockMarket(),"TEST",1, 10);
        let json = stock.toJSON();
        expect(json).not.to.be.undefined;
        expect(json.name).to.be.equal('TEST');
        expect(json.start_price).to.be.equal(10);
        expect(json.params).to.have.length(1);
        expect(json.params[0]).to.be.deep.equal({
            name: 'value',
            text: 'Value',
            value: 10
        });
    });
    it('Binomial Stock', ()=>{
        let stock: AbstractStock = new BinomialStock(new StockMarket(),"TEST2", 1,10, 2);
        let price: number = 0;
        for (let i: number = 0; i < 1000; i++){
            price = stock.price(i);
            expect(price).not.undefined;
            expect(price).to.be.approximately(10, 2*i);
        }
        expect(price).to.be.equal(stock.price());
    });
    it('Uniform Stock', ()=>{
       let stock: AbstractStock = new UniformStock(new StockMarket(),"TEST3", 1,5, 0, 10);
        for (let i: number = 0; i < 1000; i++) {
            let price = stock.price(i);
            expect(price).not.undefined;
            expect(price).to.be.approximately(5, 5);
        }
    });
    it('Bernoulli Stock', ()=>{
        let stock: AbstractStock = new BernoulliStock(new StockMarket(),"TEST4", 1,1, 10);
        for (let i: number = 0; i < 1000; i++) {
            let price = stock.price(i);
            expect(price).not.undefined;
            expect(price === 1 || price == 10).to.be.true;
        }
    })
});

describe('Brokers', ()=> {
    it('Buy and sell test', () => {
        let broker = new AfkBroker(1000, 'TEST', new StockMarket());
        let stock = new StaticStock(new StockMarket(),'TEST', 1000, 10);
        expect(broker.buy(40, stock)).to.be.true;
        expect(broker.buy(61, stock)).to.be.false;
        expect(broker.money).to.be.equal(1000 - 40 * 10);
        expect(broker.money_in_stocks).to.be.equal(40 * 10);
        expect(broker.total_money).to.be.equal(1000);
        expect(broker.sell(40, stock)).to.be.true;
        expect(broker.money).to.be.equal(1000);
        expect(broker.money_in_stocks).to.be.equal(0);
    });
    it('Time iteration test', () => {
        let broker = new AfkBroker(10000, 'TEST', new StockMarket());
        let stock = new StaticStock(new StockMarket(),'TEST', 1000, 10);
        expect(broker.portfolio).to.be.empty;
        broker.buy(40, stock);
        expect(broker.portfolio).to.haveOwnProperty('TEST');
        broker.make_a_day();
        broker.buy(40, stock);
        expect(broker.portfolio['TEST'].quantity).to.be.equal(80);
        broker.make_a_day();
        expect(broker.portfolio['TEST'].quantity).to.be.equal(80);
        broker.make_a_day();
        broker.sell(70, stock);
        expect(broker.portfolio['TEST'].quantity).to.be.equal(10);
        broker.make_a_day();
        broker.sell(10, stock);
        expect(broker.portfolio).not.to.haveOwnProperty('TEST');
        expect(broker.get_portfolio(0)['TEST'].quantity).to.be.equal(40);
        expect(broker.get_portfolio(1)['TEST'].quantity).to.be.equal(80);
        expect(broker.get_portfolio(2)['TEST'].quantity).to.be.equal(80);
        expect(broker.get_portfolio(3)['TEST'].quantity).to.be.equal(10);
        expect(broker.get_portfolio(4)).not.to.haveOwnProperty('TEST');
    });
});

describe('Stock market', ()=>{
    it('Dummy stocks', ()=>{
        let market = new StockMarket();
        let len = market.addDummyStocks();
        expect(market.stocks).to.have.length(len);
    });
    it('Dummy brokers', ()=>{
        let market = new StockMarket();
        let len = market.addDummyBrokers();
        expect(market.brokers).to.have.length(len);
    })
    it ('to JSON', ()=>{
        let market = new StockMarket();
        let len = market.addDummyStocks();
        //@ts-ignore
        let stocks: any = market.toJSON()['stocks'];
        expect(stocks).to.have.length(len);
        for (let i:number = 0; i < len; i++) {
            expect(stocks[i]).to.ownProperty('params');
            expect(stocks[i].params).to.have.length.above(0);
        }
    });
    it('ToJSON time iteration test', ()=>{
        let market = new StockMarket();
        let broker = new AfkBroker(10000, 'TEST', market);
        let stock = new StaticStock(market,'TEST', 1000, 10);
        market.simulate_to_time(1);
        broker.buy(100, stock);
        market.simulate_to_time(2);
        broker.buy(100, stock);
        market.simulate_to_time(3);
        broker.sell(50, stock);
        market.simulate_to_time(4);
        broker.sell(150, stock);
        let market_states: any = market.toJSON(0, 5);
        expect(market_states[0].brokers[0].money).equal(10000);
        expect(market_states[1].brokers[0].money).equal(9000);
        expect(market_states[2].brokers[0].money).equal(8000);
        expect(market_states[3].brokers[0].money).equal(8500);
        expect(market_states[4].brokers[0].money).equal(10000);
        expect(market_states[2].stocks[0].available_quantity).equal(800);
    })
});