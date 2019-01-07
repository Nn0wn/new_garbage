import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ComponentSyncService {
    private controls_toggled: boolean;
    private _controls_toggle_callback;

    private current_view: string;
    private _view_update_callback;

    set controls_toggle_callback(value) {
        this._controls_toggle_callback = value;
    }

    set view_update_callback(value) {
        this._view_update_callback = value;
    }

    toggle_controls() {
        this.controls_toggled = !this.controls_toggled;
        if (this._controls_toggle_callback) {
            this._controls_toggle_callback(this.controls_toggled);
        }
    }

    setView(view: string) {
        this.current_view = view;
        if (this._view_update_callback){
            this._view_update_callback(this.current_view);
        }
    }

    constructor() {
        this.controls_toggled = false;
        this.current_view = 'stocks';
    }
}
