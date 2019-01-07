import {StockMarket} from "../StockMarket";
import {logger} from "../../winston";

export abstract class AbstractStock{
    set quantity(value: number) {
        this._quantity = value;
    }
    set name(value: string) {
        this._name = value;
    }
    protected constructor(market: StockMarket, name: string, quantity: number, start_price: number) {
        this._name = name;
        this._quantity = quantity;
        this._available_quantity = [quantity];
        this.values = [];
        this.values[0] = start_price;
        this._params = {};
        this._market = market;
        this._market.add_stock(this);
    }

    price(time: number = this.values.length - 1): number{
        if (this.values.length <= time){
            for (let i: number = this.values.length; i <= time; i++){
                this.values.push(this.calculate_price(i));
                this._available_quantity.push(this.available_quantity);
            }
        }
        return this.values[time];
    }

    abstract calculate_price(time:number): number;

    add_share(quantity: number){
        if (quantity <= this.available_quantity)
            this.available_quantity -= quantity;
    }

    remove_share(quantity: number){
        if (quantity + this.available_quantity <= this.quantity)
            this.available_quantity += quantity;
    }

    toJSON(time: number = this.values.length - 1){
        let _dynamic = 0;
        if (time != 0)
            _dynamic = this.price(time) - this.price(time - 1);
        return{
            name: this.name,
            type: this.type,
            start_price: this.values[0],
            dynamic: _dynamic,
            price: this.price(time),
            available_quantity: this.get_available_quantity(time),
            quantity: this.quantity,
            params: this.params_toJSON()
        }
    }

    private params_toJSON(){
        let res = [];
        for (let name of Object.keys(this._params)){
            let param = this._params[name];
            res.push({
                name: name,
                text: param.text,
                value: param.getter()
            })
        }
        return res;
    }

    add_param(name: string, text: string, getter: () => number, setter: (value:number) => void){
        if (!(name in this._params))
            this._params[name] = {text, getter, setter}
    }

    get params(): { [p: string]: { text: string; getter: () => number; setter: (value: number) => void } } {
        return this._params;
    }

    get quantity(): number {
        return this._quantity;
    }

    set available_quantity(value: number){
        this._available_quantity[this._available_quantity.length - 1] = value;
    }

    get_available_quantity(time: number): number{
        return this._available_quantity[time]
    }

    get available_quantity(): number {
        return this.get_available_quantity(this._available_quantity.length - 1);
    }

    get name(): string {
        return this._name;
    }

    get type(): string {
        return this._type;
    }

    protected _type: string;
    private _params: {[name:string]: {text: string, getter: () => number, setter: (value:number) => void}};
    protected values: Array<number>;
    private _name: string;
    private _quantity: number;
    private _available_quantity: Array<number>;
    private _market: StockMarket;
}

