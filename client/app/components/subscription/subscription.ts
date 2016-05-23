declare var google:any;

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
export class SubscriptionComponent implements OnInit, AfterViewChecked {
    @Input() search:any;
    @Input() socket;
    public tweets:Object[];
    private tweet:any;
    private channel;
    private isPaused:boolean = false;
    private subscribed:boolean = false;
    private className:String;
    private googleMap:any;

    public ngOnInit() {
        this.className = this.search.term.replace(' ', '-');
        this.channel = btoa(this.search.term);
        this.tweets = [];
        this.activateSocket();
    }

    private activateSocket() {
        this.socket.on('twitter-stream', (tweet) => {
            this.tweet = tweet;
            this.subscribeToChannel(tweet);
        });
    }

    private newTweet(data:Object) {
        this.tweets.push(data);
    }

    public subscribeToChannel(tweet) {
        console.log("paused", this.isPaused);
        if (this.isPaused) { return; }

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
            center: {lat: 37.4316, lng: 78.6569},
            zoom: 2
        });
    }

    public ngAfterViewChecked() {
        if (!this.search.active) {
            this.isPaused = true;
        } else if (this.search.active) {
            this.isPaused = false;
        }

    }

}
