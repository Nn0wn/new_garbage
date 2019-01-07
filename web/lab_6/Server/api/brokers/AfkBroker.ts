import {AbstractBroker} from "./AbstractBroker";
import {StockMarket} from "../StockMarket";
import {AbstractStock} from "../stocks/AbstractStock";

export class AfkBroker extends AbstractBroker{
    constructor(money: number, name: string, market: StockMarket) {
        super(money, name, market);
        this._type = 'Afk';
    }

    makeDecision(): { [p: string]: { quantity: number; stock: AbstractStock } } {
        return this.copy_of_portfolio;
    }

}