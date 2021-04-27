import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '../shared/utils.service';


@Injectable({
    providedIn: 'root'
})

export class ScheduleService {

    private schluearDomain = 'https://trigger-test.sapper.ai';

    constructor(public router: Router, private utilsService: UtilsService) { }

    /**
     * Used to get the schedule by workflow id
     * @param  {string} workflowId
     * @returns Observable
     */
    getScheduleByWorkflowId(workflowId: string) {
        return this.utilsService.returnGetCall(`${this.schluearDomain}/scheduler/job/${workflowId}`);
    }

    /**
     * Used to delete the schedule by workflow id
     * @param  {string} workflowId
     * @returns Observable
     */
    deleteScheduleByWorkflowId(workflowId: string) {
        return this.utilsService.returnDeleteCall(`${this.schluearDomain}/scheduler/job/${workflowId}`);
    }

    /**
     * save schedule data
     * @param any  scheduleObject
     */
    saveSchedule(scheduleObject) {
        return this.utilsService.returnPostCall(`${this.schluearDomain}/scheduler`, scheduleObject);
    }

    /**
     * update schedule data
     * @param any  scheduleObject
     */
    updateSchedule(scheduleObject) {
        return this.utilsService.returnPutCall(`${this.schluearDomain}/scheduler`, scheduleObject);
    }

    /**
     * update schedule data for workflow level enable schedule
     * @param any  scheduleObject
     */
    enableSchedule(scheduleObject) {
        return this.utilsService.returnPutCall(`${this.schluearDomain}/scheduler/resume/${scheduleObject.id}`, scheduleObject);
    }

    /**
     * update schedule data for workflow level disable schedule
     * @param any  scheduleObject
     */
    disableSchedule(scheduleObject) {
        return this.utilsService.returnPutCall(`${this.schluearDomain}/scheduler/pause/${scheduleObject.id}`, scheduleObject);
    }

}
