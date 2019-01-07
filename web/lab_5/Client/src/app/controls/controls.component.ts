import { Component, OnInit } from '@angular/core';
import {Broker, Market, MarketService, Stock} from '../market.service';

@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.less']
})
export class ControlsComponent implements OnInit {
    private market_info;
    private stocks_info: Stock[];
    private creating_stock: Stock;
    private creating_broker: Broker;
    private unique_names: boolean;
    private action: string;
    private brokers_info: Broker[];

    constructor(private marketService: MarketService) { }

    async ngOnInit() {
        this.market_info = await this.marketService.getMarketInfo();
        this.stocks_info = this.market_info.stocks;
        this.brokers_info = this.market_info.brokers;
        this.creating_stock = JSON.parse(JSON.stringify(this.stocks_info[0]));
        this.creating_broker = JSON.parse(JSON.stringify(this.brokers_info[0]));
        this.creating_stock.name = '';
        this.creating_broker.name = '';
        this.action = '';
        this.unique_names = true;
        this.get_req_params();
        console.log(this.stocks_info);
    }

    onToggleNewStock() {
        if (this.action === 'new_stock') {
            this.action = '';
        } else {
            this.action = 'new_stock';
        }
    }

    onToggleNewBroker() {
        if (this.action === 'new_broker') {
            this.action = '';
        } else {
            this.action = 'new_broker';
        }
    }

    get_req_params() {
        if (this.creating_stock) {
            for (let i = 0; i < this.stocks_info.length; i++) {
                if (this.creating_stock.type === this.stocks_info[i].type) {
                    this.creating_stock.params = this.stocks_info[i].params;
                    for (let k = 0; k < this.creating_stock.params.length; k++) {
                        this.creating_stock.params[k].value = 0;
                    }
                    console.log(this.creating_stock.params);
                }
            }
        }
    }

    async saveStock() {
        this.action = '';
        const market = await this.marketService.getMarket();
        this.unique_names = this.marketService.check_stocks_unique_names(this.creating_stock, market);
        if (this.unique_names) {
            this.marketService.commit_stock_change(this.creating_stock, market);
        }
    }

    async saveBroker() {
        this.action = '';
        const market = await this.marketService.getMarket();
        this.unique_names = this.marketService.check_broker_unique_names(this.creating_broker, market);
        if (this.unique_names) {
            this.marketService.commit_broker_change(this.creating_broker, market);
        }
    }
}
