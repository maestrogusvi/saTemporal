import { NgModule } from '@angular/core';

import { WelComeComponent } from './welcome.component';
import { MaterialModule } from '../shared/modules/material.module';
import { WelComeRoutingModule } from './welcome-routing.module';


@NgModule({
    imports: [
        MaterialModule,
        WelComeRoutingModule
    ],
    declarations: [
        WelComeComponent
    ],
    exports: [
        WelComeComponent
    ]
})
export class WelComeModule {

}
