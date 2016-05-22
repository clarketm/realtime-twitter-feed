declare var Pusher: any;

import {bootstrap} from 'angular2/platform/browser';
import {Component, OnInit} from 'angular2/core';
import {SubscriptionComponent} from "../subscription/subscription";

@Component({
    selector: 'home',
    templateUrl: 'app/components/home/home.html',
    directives: [SubscriptionComponent],
})

export class HomeComponent implements OnInit {
    private newSearchTerm: string;
    private pusher;
    private channels: any[];

    constructor() {
        this.pusher = new Pusher('9fd1b33fcb36d968145f');
        this.channels = [];
    }

    public newSubscription() {
        this.channels.push({term: this.newSearchTerm, active: true});
        this.newSearchTerm = '';
    }

    public clearSearch(channel) {
        this.channels = this.channels.filter((ch) => {
            if (ch.term === channel.term) {
                this.toggleSearch(channel);
            }
            return ch.term !== channel.term;
        });
    }
    public toggleSearch(channel) {
        for (let ch of this.channels) {
            if (ch.term === channel.term) {
                ch.active = !ch.active;
                break;
            }
        }
    }

    ngOnInit() { }
}