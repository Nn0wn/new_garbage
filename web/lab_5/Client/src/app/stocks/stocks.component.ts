import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {Market, MarketService, Stock} from '../market.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComponentSyncService} from '../component-sync.service';

@Component({
    selector: 'app-stocks',
    templateUrl: './stocks.component.html',
    styleUrls: ['./stocks.component.less']
})
export class StocksComponent implements OnInit {
    stocks: Stock[];
    stocks_info: Stock[];
    market: Market;
    selectedStock: Stock;
    isEditable: boolean;
    unique_names: boolean;
    controls_toggled: boolean;

    constructor(private marketService: MarketService, private componentSync: ComponentSyncService) {
    }


    async ngOnInit() {
        console.log('init');
        this.market = await this.marketService.getMarket();
        const market_info = await this.marketService.getMarketInfo();
        this.unique_names = true;
        this.isEditable = true;
        const self = this;
        this.marketService.update_callback = function (new_market: Market) {
            self.market = new_market;
            self.stocks = new_market.stocks;
            if (self.selectedStock) {
                for (let i = 0; i < self.stocks.length; i++) {
                    if (self.selectedStock.name === self.stocks[i].name) {
                        self.selectedStock = self.stocks[i];
                        break;
                    }
                }
            }
            self.isEditable = self.marketService.is_editable;
        };
        this.componentSync.controls_toggle_callback = function (new_toggle: boolean) {
            self.controls_toggled = new_toggle;
            if (new_toggle) {
                self.selectedStock = null;
            }
        };
        this.stocks = this.market.stocks;
        this.stocks_info = market_info.stocks;
        console.log(this.stocks);
    }

    onChange() {
        this.unique_names = this.marketService.check_stocks_unique_names(this.selectedStock, this.market);
        if (this.unique_names) {
            this.marketService.commit_stock_change(this.selectedStock, this.market);
        }
    }

    onSelect(stock: Stock) {
        if (this.controls_toggled){
            this.componentSync.toggle_controls();
        }
        this.selectedStock = stock;
    }

    onDelete() {
        this.marketService.delete_stock(this.selectedStock, this.market);
        this.selectedStock = null;
    }
}
