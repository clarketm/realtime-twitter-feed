import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'

import {HomeComponent} from '../home/home'
import {NavComponent} from "../navbar/navbar";

@RouteConfig([
    {path: '/', component: HomeComponent, as: 'Home'}
])
@Component({
    selector: 'app',
    templateUrl: 'app/components/app/app.html',
    directives: [ROUTER_DIRECTIVES, NavComponent]
})
export class AppComponent {
    constructor(){
        console.debug("We are up and running!");
    }
    
}