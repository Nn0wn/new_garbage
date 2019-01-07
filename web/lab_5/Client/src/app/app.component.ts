import {Component, OnInit} from '@angular/core';
import {ComponentSyncService} from './component-sync.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    title = 'WEBL5frontend';
    current_view: string;

    constructor(private componentSync: ComponentSyncService) {
    }

    ngOnInit() {
        const self = this;
        this.componentSync.view_update_callback = function (view) {
            self.current_view = view;
        };
        this.current_view = 'stocks';
    }
}
