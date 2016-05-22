declare var google: any;

import {
    Component,
    Input,
    AfterViewChecked,
    OnInit,
    OnDestroy,
} from 'angular2/core';

@Component({
    selector: 'subscription',
    templateUrl: 'app/components/subscription/subscription.html'
})
export class SubscriptionComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewChecked {
    @Input() search:any;
    @Input() pusher;
    public tweets:Object[];
    private channel;
    private subscribed:boolean = false;
    private className:String;
    private googleMap:any;

    public ngOnInit() {
        this.subscribeToChannel();
        this.tweets = [];
        this.className = this.search.term.replace(' ', '-');
    }

    private subscribeToChannel() {
        this.channel = this.pusher.subscribe(btoa(this.search.term));
        this.channel.bind('new_tweet', (data) => {
            if (data.tweet.geo && data.tweet.user.profile_image_url) {
                this.newTweet(data);
                let lat = data.tweet.geo.coordinates[0],
                    long = data.tweet.geo.coordinates[1],
                    marker = new google.maps.Marker({
                        position: {lat: lat, lng: long},
                        map: this.googleMap,
                        icon: data.tweet.user.profile_image_url,
                        animation: google.maps.Animation.DROP
                    }),
                    contentString =
                        `
                        <div class="info-window title"></div>
                        <div class="info-window sub-title">" + office + </div>
                        <div class="info-window"> + short_address + <br> + city + ", " + state + " " + zip + </div>
                        <div class="info-window direction-div"><div class="direction-icon"></div>
                        <!--<a class="google-link save-button-link" target="_blank" href="https://www.google.com/maps/dir/Current+Location/ + daddr + ">Get Directions</a></div>-->
                        `,
                    infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                marker.addListener('click', function () {
                    infowindow.open(this.googleMap, marker);
                });
                this.googleMap.setCenter(marker.getPosition());
            }
        });
        this.subscribed = true;
    }

    private newTweet(data:Object) {
        this.tweets.push(data);
    }

    public ngOnDestroy() {
        this.pusher.unsubscribe(btoa(this.search.term));
        this.channel && this.channel.unbind();
        this.subscribed = false;
    }

    public ngAfterViewInit() {
        let mapId = document.querySelector("#map-" + this.className),
            listItem = document.querySelector(".channel-" + this.className);
        if (mapId) {
            this.createGoogleMap(mapId);
        }
        if (listItem) {
            listItem.scrollTop = listItem.scrollHeight;
        }
    }

    public createGoogleMap(mapId) {
        this.googleMap = new google.maps.Map(mapId, {
            center: {lat: -34.397, lng: 150.644},
            zoom: 5
        });
    }

    public ngAfterViewChecked() {
        if (!this.search.active && this.subscribed) {
            this.ngOnDestroy();
        } else if (this.search.active && !this.subscribed) {
            this.subscribeToChannel();
        }

    }
}
