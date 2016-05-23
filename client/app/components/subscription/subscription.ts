declare var google:any;
declare var io:any;

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
    @Input() socket;
    public tweets:Object[];
    private channel;
    private subscribed:boolean = false;
    private className:String;
    private googleMap:any;

    public ngOnInit() {
        this.className = this.search.term.replace(' ', '-');
        this.channel = btoa(this.search.term);
        this.tweets = [];
        this.socket.on('twitter-stream', (tweet) => {
            this.subscribeToChannel(tweet);
        });
    }

    private newTweet(data:Object) {
        this.tweets.push(data);
    }

    public subscribeToChannel(tweet) {
        let lat = tweet.geo.coordinates[0],
            long = tweet.geo.coordinates[1],
            marker = new google.maps.Marker({
                position: {lat: lat, lng: long},
                map: this.googleMap,
                icon: tweet.user.profile_image_url,
                animation: google.maps.Animation.DROP
            }),
            contentString =
                `<p><a href="http://twitter.com/${tweet.user.name}">${tweet.user.name}</a></p>
                 <p>${tweet.text}</p>;`,
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });
        google.maps.event.addListener(marker, 'click', () => {
            infowindow.open(this.googleMap, marker);
        });
        this.googleMap.setCenter(marker.getPosition());
        this.subscribed = true;
    }

    public ngAfterViewInit() {
        console.log("init");
        console.log(this.className);
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
        console.log("create map");
        this.googleMap = new google.maps.Map(mapId, {
            center: {lat: 37.4316, lng: 78.6569},
            zoom: 2
        });
    }

    ngOnDestroy():any {
        this.subscribed = false;
    }

    public ngAfterViewChecked() {
        if (!this.search.active && this.subscribed) {
            this.ngOnDestroy();
        } else if (this.search.active && !this.subscribed) {
            //this.subscribeToChannel();
        }

    }

}
