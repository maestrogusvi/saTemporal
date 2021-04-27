import { IWorkflowPayload } from './workflow.interface';

export class WorkflowProp {

    workflowProp: IWorkflowPayload;

    constructor(workflowProp) {
        this.workflowProp = {
            process: {
                processProp: {
                    id: workflowProp.workflowId ? workflowProp.workflowId : '',
                    name: workflowProp.name ? workflowProp.name : '',
                    documentation: workflowProp.description ? workflowProp.description : '',
                    isExecutable: workflowProp.isExecutable ? workflowProp.isExecutable : 'true'
                },
                sequenceFlow: workflowProp.sequenceFlow ? workflowProp.sequenceFlow : [],
                startEvent: workflowProp.startEvent ? workflowProp.startEvent : null,
                endEvent: workflowProp.endEvent ? workflowProp.endEvent : null
            }
        };
    }
}
