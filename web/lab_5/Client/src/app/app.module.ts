import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StocksComponent } from './stocks/stocks.component';
import { StockInfoComponent } from './stock-info/stock-info.component';
import {SidebarModule} from 'ng-sidebar';
import { ControlsComponent } from './controls/controls.component';
import { BrokersComponent } from './brokers/brokers.component';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        StocksComponent,
        StockInfoComponent,
        ControlsComponent,
        BrokersComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SidebarModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
