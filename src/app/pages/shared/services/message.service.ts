import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MessageService {

    private messageSource = new BehaviorSubject('default message');
    getMessage = this.messageSource.asObservable();
    getWorkflowData = this.messageSource.asObservable();

    constructor() { }

    setMessage(message: string) {
        this.messageSource.next(message);
    }
    setWorkflowData(object) {
        this.messageSource.next(object);
    }
}
