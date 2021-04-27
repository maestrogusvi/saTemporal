import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '../shared/utils.service';


@Injectable({
    providedIn: 'root'
})

export class TenantSettingsService {

    constructor(public router: Router, private utilsService: UtilsService) { }

    /**
     * update schedule data for tenant level enable schedule
     * @param any  scheduleObject
     */
    enableTenantSchedule(tenantId) {
        return this.utilsService.returnPutCall(`/scheduler/resume-tenant/${tenantId}`, {});
    }

    /**
     * update schedule data for tenant level disable schedule
     * @param any  scheduleObject
     */
    disableTenantSchedule(tenantId) {
        return this.utilsService.returnPutCall(`/scheduler/pause-tenant/${tenantId}`, {});
    }
}
