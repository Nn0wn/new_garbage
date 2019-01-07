import {AbstractStock} from "../stocks/AbstractStock";
import {StockMarket} from "../StockMarket";

export abstract class AbstractBroker{
    protected constructor(money: number, name: string, market: StockMarket){
        this._money = money;
        this._start_money = money;
        this._name = name;
        this._portfolio = [{}];
        this._market = market;
        this._market.add_broker(this);
        this._type = '';
        this._online = false;
    }

    abstract makeDecision():{[name:string]: {quantity: number, stock: AbstractStock}}

    get_portfolio(time: number): {[name:string]: {quantity: number, stock: AbstractStock}}{
        if (this._portfolio.length > time){
            return this._portfolio[time];
        }
        else return {}
    }

    set_portfolio(stocks: {name: string, quantity: number, stock: AbstractStock}[]){
        this._portfolio = [{}];
        stocks.forEach((stock)=>{
            this.portfolio[stock.name] = {quantity: stock.quantity, stock: stock.stock}
        });
        this._start_money += this.money_in_stocks
    }

    make_a_day(){
        this._portfolio.push(this.makeDecision());
    }

    get portfolio(): { [p: string]: { quantity: number; stock: AbstractStock } } {
        return this._portfolio[this._portfolio.length - 1];
    }

    protected get copy_of_portfolio(){
        let res: { [p: string]: { quantity: number; stock: AbstractStock } } = {};
        Object.keys(this.portfolio).forEach((stock_name: string) => {
            res[stock_name] = {
                quantity: this.portfolio[stock_name].quantity,
                stock: this.portfolio[stock_name].stock
            }
        });
        return res
    }

    buy(quantity: number, stock: AbstractStock): boolean{
        if ((stock.price() * quantity <= this.money) && (stock.available_quantity >= quantity)){
            this._money -= stock.price() * quantity;
            if (stock.name in this.portfolio){
                this.portfolio[stock.name].quantity += quantity;
            }
            else{
                this.portfolio[stock.name] = {quantity, stock};
            }
            stock.add_share(quantity);
            return true
        }
        return false
    }

    sell(quantity: number, stock: AbstractStock): boolean{
        if (this.portfolio[stock.name].quantity >= quantity){
            this.portfolio[stock.name].quantity -= quantity;
            console.log(quantity, this.portfolio[stock.name].quantity);
            this._money += stock.price() * quantity;
            if (this.portfolio[stock.name].quantity === 0){
                delete this.portfolio[stock.name];
            }
            stock.remove_share(quantity);
            return true
        }
        return false
    }

    toJSON(time: number = this._portfolio.length - 1): object{
        let stocks = [];
        for(let stock_name of Object.keys(this.get_portfolio(time))){
            stocks.push({
                name: this.get_portfolio(time)[stock_name].stock.name,
                quantity: this.get_portfolio(time)[stock_name].quantity
            })
        }
        return {
            name: this.name,
            type: this.type,
            online: this.online,
            money: this.get_money(time),
            money_in_stocks: this.get_money_in_stocks(time),
            total_money: this.total_money,
            start_money: this._start_money,
            stocks: stocks
        };
    }

    get_money_in_stocks(time: number): number{
        let money_in_shares: number = 0;
        Object.keys(this.get_portfolio(time)).forEach((stock_name: string)=>{
            money_in_shares += this.get_portfolio(time)[stock_name].quantity *
                this.get_portfolio(time)[stock_name].stock.price(time);
        });
        return money_in_shares;
    }

    reset(){
        this._money = this._start_money;
        this._portfolio = [this.get_portfolio(0)]
    }

    get money_in_stocks(): number{
        return this.get_money_in_stocks(this._portfolio.length - 1);
    }

    get total_money(): number{
        return this._money + this.money_in_stocks;
    }

    get_money(time: number = this._portfolio.length - 1): number{
        if (time === this._portfolio.length - 1)
            return this.money;
        return this.total_money - this.get_money_in_stocks(time);
    }

    get money(): number {
        return this._money;
    }

    get name(): string {
        return this._name;
    }

    get type(): string {
        return this._type;
    }

    set name(value: string) {
        this._name = value;
    }

    get online(): boolean{
        return this._online;
    }

    set online(value: boolean){
        this._online = value;
    }

    private _name: string;
    protected _type: string;
    protected _portfolio: {[name:string]: {quantity: number, stock: AbstractStock}}[];
    private _money: number;
    protected _market: StockMarket;
    private _online: boolean;
    private _start_money: number;
}