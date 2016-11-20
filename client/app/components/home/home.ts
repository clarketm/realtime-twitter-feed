declare var io:any;

import {Component} from 'angular2/core';
import {SubscriptionComponent} from "../subscription/subscription";


@Component({
    selector: 'home',
    templateUrl: 'app/components/home/home.html',
    directives: [SubscriptionComponent],
})

export class HomeComponent {
    private newSearchTerm:string;
    private socket:any;
    private channels:any[];

    constructor() {
        this.socket = io.connect();
        this.channels = [];
    }

    public newSubscription() {
        if (this.hasSearchterm(this.newSearchTerm)) {
            return this.goToSearchTerm(this.newSearchTerm.replace(" ", "-"));
        }
        this.socket.emit('search', this.newSearchTerm);
        this.channels.push({term: this.newSearchTerm, active: true});
        this.newSearchTerm = '';
    }

    hasSearchterm(term) {
        return this.channels.find((item) => item.term === term);
    }

    goToSearchTerm(className) {
        let mapId = <HTMLElement>document.querySelector("#map-" + className);
        this.newSearchTerm = '';
        window.scrollTo(0, mapId.offsetTop - 150);
    }

    public clearSearch(channel) {
        this.channels = this.channels.filter((ch:any) => {
            if (ch.term === channel.term) {
                this.socket.emit('delete', ch.term);
            }
            return ch.term !== channel.term;
        });
    }

    public toggleSearch(channel) {
        for (let ch of this.channels) {
            if (ch.term === channel.term) {
                ch.active = !ch.active;
                this.socket.emit('toggle', ch.term, ch.active);
                break;
            }
        }
    }
}