import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { NumberSymbol } from '@angular/common';
import { ApprovalService } from 'src/app/services/approval.service';
import { ApprovalInterface } from 'src/app/interfaces/Approval.Interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  initApproval: any = {
    totalPages: 0,
    totalCount: 0,
    previous: 0,
    next: 0,
    data:[]
  }

  private count = new BehaviorSubject<number>(1);
  private approvalList = new BehaviorSubject<any>(this.initApproval);

  notifCount = this.count.asObservable();

  constructor(private approvalService: ApprovalService) {
    this.setNotificationService();
  }

  setNotificationService(){
    var authToken = JSON.parse(sessionStorage.getItem("AuthToken")!)
    if(authToken.RoleName == "ADMIN"){
    this.approvalService.getPendingForApproval(1,5).subscribe((res: any) => {
      this.count.next(res.totalCount);
      sessionStorage.setItem("approvalList", JSON.stringify(res.data));
      this.approvalList.next(res);
    })
  }
  }

  getNotificationCount(){
    return this.count.asObservable();
  }

  getNotificationList(){
    return this.approvalList.asObservable();
  }
}
