import {AbstractStock} from "./AbstractStock";
import {getRandomInt} from "../Math";
import {StockMarket} from "../StockMarket";

export class BernoulliStock extends AbstractStock{

    constructor(market: StockMarket, name: string, quantity: number, start_price: number, second_price: number) {
        super(market, name, quantity, start_price);
        this._type = "Bernoulli";
        this._first_price = start_price;
        this._second_price = second_price;
        this.add_param('first_price', 'First price',
            ()=>{return this._first_price},
            (new_value: number)=>{this._first_price = new_value});
        this.add_param('second_price', 'Second price',
            ()=>{return this._second_price},
            ()=>(new_value:number)=>{this._second_price = new_value})
    }

    calculate_price(time: number): number {
        if (getRandomInt(1) == 1){
            return this._first_price;
        }
        else
            return this._second_price;
    }


    get first_price(): number {
        return this._first_price;
    }

    set first_price(value: number) {
        this._first_price = value;
    }
    get second_price(): number {
        return this._second_price;
    }

    set second_price(value: number) {
        this._second_price = value;
    }

    private _second_price: number;
    private _first_price: number;


}