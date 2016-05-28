import {count} from "rxjs/operator/count";
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
export class SubscriptionComponent implements OnInit {
    private count = 0;

    @Input() search:any;
    @Input() socket;

    private className:String;
    private googleMap:any;
    private heatMap:any;
    private infowindow:any;
    private markers:any = new Map();
    private points:any = new google.maps.MVCArray();
    private isVisibleMarkers:boolean = true;
    private isVisibleHeatMap:boolean = true;

    public ngOnInit() {
        this.className = this.search.term.replace(' ', '-');
        this.infowindow = new google.maps.InfoWindow({
            maxWidth: 280
        });
        this.activateSocket();
    }

    private activateSocket() {
        this.socket.on(btoa(this.search.term), (tweet) => {
            this.count++;
            this.subscribeToChannel(tweet);
        });
    }

    public subscribeToChannel(tweet) {
        let lat = tweet.geo.coordinates[0],
            long = tweet.geo.coordinates[1],
            marker = new google.maps.Marker({
                id: this.count.toString(),
                position: {lat: lat, lng: long},
                map: this.isVisibleMarkers ? this.googleMap : null,
                icon: tweet.user.profile_image_url,
                animation: google.maps.Animation.DROP
            }),
            contentString =
                `<div style="position: relative">
                 <h5>${tweet.user.name}</h5>
                 <h6><a href="http://twitter.com/${tweet.user.screen_name}">@${tweet.user.screen_name}</a></h6>
                 <p style="font-size: 15px">${tweet.text}</p>
                 <button data-id="marker-${marker.id}" style="padding: 5px; font-size: 10px; position: absolute; top: -10px; right:0">remove</button>
                 </div>`;

        console.debug(tweet);
        this.markers.set(marker.id, marker);
        this.points.push(new google.maps.LatLng(lat, long));

        google.maps.event.addListener(marker, 'click', () => {
            this.infowindow.setContent(contentString);
            this.infowindow.open(this.googleMap, marker);
        });
        this.googleMap.setCenter(marker.getPosition());
    }

    public deleteMarker(event){
        event.stopPropagation();
        let dataId = event.target.getAttribute("data-id");
        if (dataId) {
            dataId = event.target.getAttribute("data-id").split("-")[1];
            this.markers.get(dataId).setMap(null);
            this.markers.delete(dataId);
            this.points.removeAt(dataId-1);
        }
    }

    public ngAfterViewInit() {
        let mapId = document.querySelector("#map-" + this.className);

        if (mapId) {
            this.createGoogleMap(mapId);
            window.scrollTo(0, mapId.offsetTop - 150);
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
        this.markers.forEach((marker) => marker.setMap(map));
    }

    private toggleMarkers() {
        this.isVisibleMarkers = !this.isVisibleMarkers;
        this.isVisibleMarkers ? this.setMapOnAll(this.googleMap) : this.setMapOnAll(null);
    }

    private toggleHeatMap() {
        this.isVisibleHeatMap = !this.isVisibleHeatMap;
        this.heatMap.setMap(this.isVisibleHeatMap ? this.googleMap : null);
    }

}
