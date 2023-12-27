import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ApprovalInterface } from 'src/app/interfaces/Approval.Interface';
import { ApprovalService } from 'src/app/services/approval.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationConfirmationComponent } from 'src/app/shared/components/header/notification-confirmation/notification-confirmation.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, AfterViewInit  {

  isLoading = false;
  dataSource: MatTableDataSource<ApprovalInterface> = new MatTableDataSource();
  totalRows!: number;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 15, 20, 100];
  Approved: boolean = false;
  ApprovalTable:ApprovalInterface;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private approvalService: ApprovalService,
    private _snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.loadData();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns = ['location_name', 'name','entityname','requestedBy','operation','action'];

  loadData(){
    this.notificationService.setNotificationService();

    this.notificationService.getNotificationList().subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.totalRows = res.totalCount;
    })
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  // ApprovalStatus(status: string,row:ApprovalInterface){
  //   this.Approved = (status == 'APPROVED' ? true : false)
  //   row.Approval = this.Approved;
  //   this.ApprovalTable = row;
  // }

  openConfirmation(status: string,row: ApprovalInterface){
    this.Approved = (status == 'APPROVE' ? true : false)
    row.Approval = this.Approved;
    this.ApprovalTable = row;
    sessionStorage.setItem("approvalStatus", status);
    sessionStorage.setItem("approveInterface", JSON.stringify(this.ApprovalTable));
    this.dialog.open(NotificationConfirmationComponent,{
      height: '350px',
      width: '500px',
      data:{ name: status.toString().toLowerCase() }
    })
  }
}

