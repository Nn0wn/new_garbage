import { Component, OnInit } from '@angular/core';
import {MarketService} from '../market.service';
import {ComponentSyncService} from '../component-sync.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
    day: number;
    max_day: number;

    onControlsToggle() {
        this.componentSync.toggle_controls();
    }

    onShowStocks(){
        this.componentSync.setView('stocks');
    }

    onShowBrokers(){
        this.componentSync.setView('brokers');
    }

    constructor(private marketService: MarketService, private componentSync: ComponentSyncService) { }

    ngOnInit() {
        this.day = 0;
        this.max_day = 0;
    }
    async onNext() {
        await this.marketService.forward();
        this.day = this.marketService.day;
        this.max_day = this.marketService.max_day;
    }
    async onBack() {
        await this.marketService.back();
        this.day = this.marketService.day;
        this.max_day = this.marketService.max_day;
    }
    async updateDay() {
        console.log(this.day);
        await this.marketService.go_to_day(this.day);
        console.log('finished');
        this.day = this.marketService.day;
        this.max_day = this.marketService.max_day;
    }
}
