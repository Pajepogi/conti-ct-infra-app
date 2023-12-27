import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApprovalInterface } from 'src/app/interfaces/Approval.Interface';
import { ApprovalService } from 'src/app/services/approval.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-notification-confirmation',
  templateUrl: './notification-confirmation.component.html',
  styleUrls: ['./notification-confirmation.component.css']
})
export class NotificationConfirmationComponent implements OnInit {

  ApprovalTable:any;
  approvalStatus:any;
  constructor(private dialogRef:MatDialogRef<MatDialog>,
              private approvalService: ApprovalService,
              private notificationService: NotificationService,
              private _snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: {name: string} ) {}

  ngOnInit() {
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

  saveRecordDialog(){
    var rec = JSON.parse(sessionStorage.getItem("approveInterface")!);
    this.ApprovalTable = rec;
    this.UpdateStatus();
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }

  UpdateStatus(){
    this.approvalService.updateRecord(this.ApprovalTable, 'Approval').subscribe(res => {
      this.openSnackBar('Transaction updated Successfully');
      this.notificationService.setNotificationService();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }
}
