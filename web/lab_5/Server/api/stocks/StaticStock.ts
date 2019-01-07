import {AbstractStock} from "./AbstractStock";
import {StockMarket} from "../StockMarket";
import {logger} from "../../winston";

export class StaticStock extends AbstractStock{

    constructor(market: StockMarket, name: string, quantity: number, start_price: number) {
        super(market, name, quantity, start_price);
        this._type = 'Static';
        this.add_param("value", "Value",
            ()=>{ return this.values[0] },
            (new_value: number)=>{ this.values[0] = new_value; })
    }

    calculate_price(time: number): number {
        logger.info(`Static stock: calculating price ${time}. Values number: ${this.values.length}`);
        return this.values[0];
    }
}