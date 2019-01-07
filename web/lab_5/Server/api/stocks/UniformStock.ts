import {AbstractStock} from "./AbstractStock";
import {getRandomRangeInt} from "../Math";
import {StockMarket} from "../StockMarket";

export class UniformStock extends AbstractStock{

    constructor(market: StockMarket, name: string, quantity: number, start_price: number, min_price: number, max_price: number) {
        super(market, name, quantity, start_price);
        this._type = 'Uniform';
        this._min_price = min_price;
        this._max_price = max_price;
        this.add_param('first_price', 'First price',
            ()=>{return this._min_price},
            (new_value: number)=>{this._min_price = new_value});
        this.add_param('second_price', 'Second price',
            ()=>{return this._max_price},
            (new_value: number)=>{this._max_price = new_value});
    }

    calculate_price(time: number): number {
        return getRandomRangeInt(this._min_price, this._max_price)
    }

    get min_price(): number {
        return this._min_price;
    }

    set min_price(value: number) {
        this._min_price = value;
    }

    get max_price(): number {
        return this._max_price;
    }

    set max_price(value: number) {
        this._max_price = value;
    }

    private _min_price: number;
    private _max_price: number;

}