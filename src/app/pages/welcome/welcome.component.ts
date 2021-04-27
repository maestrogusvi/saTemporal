
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'sapper-welcome-component',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelComeComponent {

    constructor(public router: Router) {
    }

}
