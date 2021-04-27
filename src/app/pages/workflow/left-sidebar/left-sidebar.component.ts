import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { animate, keyframes, state, style, trigger, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowListingService } from '../workflow-listing/workflow-listing.service';
import { MessageService } from '../../shared/services/message.service';

const transform = "translate3d(-4px, 0, 0)";
@Component({
  selector: 'sapper-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  animations: [
    trigger('customAnm', [
      transition('* => true', [
        style({ transform: 'translateX(-200px)' }),
        animate('0.5s ease-out',
          style({ transform: 'translateX(0px)' }))
      ])
    ]),
    trigger('shakeit', [
      state('shakestart', style({
        transform: 'scale(1)',
      })),
      state('shakeend', style({
        transform: 'scale(1)',
      })),
      transition('* => shakestart', animate('1000ms ease-in', keyframes([
        style({ transform: 'translate3d(-1px, 0, 0)', offset: 0.1 }),
        style({ transform: 'translate3d(2px, 0, 0)', offset: 0.2 }),
        style({ transform, offset: 0.3 }),
        style({ transform: 'translate3d(4px, 0, 0)', offset: 0.4 }),
        style({ transform, offset: 0.5 }),
        style({ transform: 'translate3d(4px, 0, 0)', offset: 0.6 }),
        style({ transform, offset: 0.7 }),
        style({ transform: 'translate3d(2px, 0, 0)', offset: 0.8 }),
        style({ transform: 'translate3d(-1px, 0, 0)', offset: 0.9 }),
      ]))),
    ])
  ]
})
export class LeftSidebarComponent implements OnInit {

  @Input() appData;
  @Input() activeWorkflow;
  @Input() triggerData;
  @Input() coreData;
  @Input() helperData;
  @Input() isDisplayNodes: boolean;
  displayTab = '';
  searchApp;
  custAnm = 'false';
  dragedItems: Array<any> = [];
  states = {};
  workflows = [];
  currentWorkflowData;

  currentworkflowId;

  @Output() addNode = new EventEmitter<string>();
  @Output() currentWorkflow = new EventEmitter<any>();


  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    readonly workflowListingService: WorkflowListingService,
    readonly messageService: MessageService
  ) {
    this.currentWorkflowData = this.router.getCurrentNavigation().extras.state;
    // get ID if opening workflow from listing page
    this.currentworkflowId = this.actRoute.snapshot.params.id;
    this.states['state1'] = 'shakestart';
    this.messageService.getMessage.subscribe((message) => {
      if (message && message.toLowerCase() === 'workflow created') {
        this.getWorkflowList();
      }
    });
  }

  ngOnInit() {
    this.getWorkflowList();
  }

  /**
   * Used to get workflow listing
   * @returns void
   */
  getWorkflowList(): void {
    this.workflowListingService.getWorkflowList().subscribe(data => {
      this.workflows = data.data;
      if (this.currentWorkflowData) {
        const indexOfnewworkflow = this.workflows.findIndex(item => item.id === this.currentWorkflowData.process.id);
        if (indexOfnewworkflow !== -1) {
          this.onWorkflowClick(this.workflows[indexOfnewworkflow]);
        }
      } else {
        if (this.currentworkflowId) {
          const indexOfnewworkflow = this.workflows.findIndex(item => item.id === this.currentworkflowId);
          if (indexOfnewworkflow !== -1) {
            this.onWorkflowClick(this.workflows[indexOfnewworkflow]);
          } else {
            this.onWorkflowClick(this.workflows[0]);

          }
        }
      }
    });
  }

  shakeMe(stateVar: string) {
    this.states[stateVar] = (this.states[stateVar] === 'shakestart' ? 'shakeend' : 'shakestart');
  }

  shakeEnd(stateVar: string) {
    this.states[stateVar] = 'shakeend';
  }

  addNodeActive() {
    if (!this.displayTab) {
      this.displayTab = 'app';
    }
    this.shakeMe('state1');
  }

  /**
   *
   * @param tabname opens tab which passes to function and toggle between tabs
   */
  openCloseTab(tabname: any): void {
    this.displayTab = this.displayTab === tabname ? '' : tabname;
    this.custAnm = this.displayTab ? 'true' : 'false';
    if (this.searchApp) {
      this.searchApp = '';
    }
  }

  /**
   * hides current opened tab
   */
  hideTab(): void {
    this.displayTab = '';
  }

  /**
   * Hides text in search input
   */
  clearSearch(): void {
    this.searchApp = '';
  }

  onWorkflowClick(workflow): void {
    if (workflow) {
      this.activeWorkflow = workflow;
      this.currentWorkflow.emit(workflow);
    }
  }
}
