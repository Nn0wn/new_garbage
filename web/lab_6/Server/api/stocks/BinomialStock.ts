import {AbstractStock} from "./AbstractStock";
import {getRandomInt} from "../Math";
import {StockMarket} from "../StockMarket";

export class BinomialStock extends AbstractStock{
    constructor(market: StockMarket, name: string, quantity: number, start_price: number, variation: number = 1) {
        super(market, name, quantity, start_price);
        this._variation = variation;
        this._type = 'Binomial';
        this.add_param('variation', 'Variation',
            ()=>{return this._variation},
            (new_value: number) => {this._variation = new_value})
    }

    calculate_price(time: number): number {
        return this.price(time - 1) + getRandomInt(this._variation) * (getRandomInt(1)*2 - 1)
    }

    get variation(): number {
        return this._variation;
    }

    set variation(value: number) {
        this._variation = value;
    }

    private _variation: number;
}