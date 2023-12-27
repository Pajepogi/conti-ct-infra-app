import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApprovalService } from 'src/app/services/approval.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/shared/components/header/notification/notification.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  count:Observable<number>;
  test:any;
  NotificationCount: boolean;
  userRole: string = "";
  public title : Observable<string>;
  constructor(private approvalService: ApprovalService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
      this.NotificationCount = false;
      var authToken = JSON.parse(sessionStorage.getItem("AuthToken")!);
      if(authToken.RoleName == "ADMIN"){
        this.NotificationCount = true;
      }
    }

   ngOnInit() {
    this.count = this.notificationService.getNotificationCount();
  }

  openDialog() {
   this.dialog.open(NotificationComponent);
  }

  openDialogContact() {
    this.dialog.open(ContactsComponent);
   }

}
