import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';

import { MetaConnectionComponent } from './meta-connection.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { ToastrModule } from 'ngx-toastr';

describe('MetaConnectionComponent', () => {
    let component: MetaConnectionComponent;
    let fixture: ComponentFixture<MetaConnectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MetaConnectionComponent],
            imports: [
              MaterialModule,
              RouterTestingModule,
              TranslateModule.forRoot(),
              HttpClientTestingModule,
              ToastrModule.forRoot()
            ],
            providers: [
              { provide: MatDialogRef, useValue: {} },
              { provide: MAT_DIALOG_DATA, useValue: [] },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MetaConnectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
