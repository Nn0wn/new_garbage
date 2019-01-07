import { Component, OnInit } from '@angular/core';
import {Broker, Market, MarketService} from '../market.service';
import {ComponentSyncService} from '../component-sync.service';

@Component({
    selector: 'app-brokers',
    templateUrl: './brokers.component.html',
    styleUrls: ['./brokers.component.less']
})
export class BrokersComponent implements OnInit {
    brokers: Broker[];
    brokers_info: Broker[];
    market: Market;
    selectedBroker: Broker;
    isEditable: boolean;
    unique_names: boolean;
    controls_toggled: boolean;

    constructor(private marketService: MarketService, private componentSync: ComponentSyncService) { }

    async ngOnInit() {
        this.market = await this.marketService.getMarket();
        const market_info = await this.marketService.getMarketInfo();
        this.isEditable = true;
        this.unique_names = true;
        const self = this;
        this.marketService.update_callback = function (new_market: Market) {
            self.market = new_market;
            self.brokers = new_market.brokers;
            if (self.selectedBroker){
                for (let i = 0; i < self.brokers.length; i++) {
                    if (self.selectedBroker.name === self.brokers[i].name){
                        self.selectedBroker = self.brokers[i];
                        break;
                    }
                }
            }
        };
        this.componentSync.controls_toggle_callback = function (new_toggle: boolean) {
            self.controls_toggled = new_toggle;
            if (new_toggle) {
                self.selectedBroker = null;
            }
        };
        this.brokers = this.market.brokers;
        this.brokers_info = market_info.brokers;
        console.log(this.brokers);
    }
    onSelect(broker: Broker) {
        if (this.controls_toggled) {
            this.componentSync.toggle_controls();
        }
        this.selectedBroker = broker;
    }
    onChange() {
        this.unique_names = this.marketService.check_broker_unique_names(this.selectedBroker, this.market);
        if (this.unique_names) {
            this.marketService.commit_broker_change(this.selectedBroker, this.market);
        }
    }
    onDelete() {
        this.marketService.delete_broker(this.selectedBroker, this.market);
        this.selectedBroker = null;
    }
}
