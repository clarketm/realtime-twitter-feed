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
    private markers:any[] = [];
    private googleMap:any;
    private heatMap:any;
    private infowindow:any;
    private points:any[] = new google.maps.MVCArray();

    isVisibleMarkers:boolean = true;
    isVisibleHeatMap:boolean = true;

    public ngOnInit() {
        this.className = this.search.term.replace(' ', '-');
        this.channel = btoa(this.search.term);
        this.infowindow = new google.maps.InfoWindow({
            maxWidth: 240
        });
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
        if (this.isPaused) {
            return;
        }

        let lat = tweet.geo.coordinates[0],
            long = tweet.geo.coordinates[1],
            marker = new google.maps.Marker({
                position: {lat: lat, lng: long},
                map: this.isVisibleMarkers ? this.googleMap : null,
                icon: tweet.user.profile_image_url,
                animation: google.maps.Animation.DROP
            }),
            contentString =
                `<h5>${tweet.user.name}</h5>
                <h6><a href="http://twitter.com/${tweet.user.screen_name}">@${tweet.user.screen_name}</a></h6>
                 <p style="font-size: 15px">${tweet.text}</p>`;

        console.debug(tweet);
        this.markers.push(marker);
        this.points.push(new google.maps.LatLng(lat, long));

        google.maps.event.addListener(marker, 'click', () => {
            this.infowindow.setContent(contentString);
            this.infowindow.open(this.googleMap, marker);
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
            center: {lat: 37.4316, lng: -78.6569},
            minZoom: 2,
            maxZoom: 15,
            zoom: 2
        });

        this.heatMap = new google.maps.visualization.HeatmapLayer({
            data: this.points,
            map: this.googleMap
        });
    }

    private setMapOnAll(map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    }

    private toggleMarkers() {
        this.isVisibleMarkers = !this.isVisibleMarkers;
        this.isVisibleMarkers ? this.setMapOnAll(this.googleMap) : this.setMapOnAll(null);
    }

    private toggleHeatMap() {
        this.isVisibleHeatMap = !this.isVisibleHeatMap;
        this.heatMap.setMap(this.isVisibleHeatMap ? this.googleMap : null);
    }

    public ngAfterViewChecked() {
        if (!this.search.active) {
            this.isPaused = true;
        } else if (this.search.active) {
            this.isPaused = false;
        }

    }

}
