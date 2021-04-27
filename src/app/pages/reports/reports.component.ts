import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from './reports.service';
import { UtilsService } from '../shared/utils.service';
import { WorkflowListingService } from '../workflow/workflow-listing/workflow-listing.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'sapper-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  dashboardDetails;
  displayedColumns: string[] = ['automation', 'triggerType', 'status', 'executionStartTime', 'executionEndTime'];
  dataSource: MatTableDataSource<any>;
  workflows;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dashboardService: DashboardService,
    private reportService: ReportsService,
    private utilSerice: UtilsService,
    private workflowListingService: WorkflowListingService) { }

  ngOnInit(): void {
    this.getDashboardDetails();
    this.getWorkflowList();
    this.getExecutionDetails();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getDashboardDetails() {
    this.dashboardService.getDashboardDetails().subscribe(data => {
      this.dashboardDetails = data.data;
    });
  }

  /**
   * Used to get workflow listing
   * @returns void
   */
  getWorkflowList(): void {
    this.workflowListingService.getWorkflowList().subscribe(data => {
      this.workflows = data.data;
    });
  }

  getExecutionDetails(): void {
    this.reportService.getExecutionHistory().subscribe((data) => {
      if (data.data && data.data.content) {
        this.dataSource = new MatTableDataSource(this.utilSerice.fetchResponseData(data).content);
      }
    });
  }

  returnWorkflowName(id): Array<any> {
    if (this.workflows) {
      return this.workflows.filter((item) => item.id === id);
    }
    return [];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
