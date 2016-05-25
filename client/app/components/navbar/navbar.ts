import {Component} from 'angular2/core';

@Component({
    selector: 'navbar',
    templateUrl: 'app/components/navbar/navbar.html'
})

export class NavComponent {
    private active: string;

    constructor() {}

}