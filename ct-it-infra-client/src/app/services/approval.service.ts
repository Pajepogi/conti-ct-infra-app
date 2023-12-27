import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApprovalInterface } from 'src/app/interfaces/Approval.Interface';

@Injectable({
  providedIn: 'root'
})

export class ApprovalService {

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient){

  }

  getPendingForApproval(pageNo: number, pageSize: number){
    return this.http.get(this.baseUrl + 'Approval?pageNumber=' + pageNo + '&pageSize=' + pageSize,
    { 'headers': this.headers }).pipe(
      map(resp => resp ),
      catchError(err => of(false))
    );
  }

  updateRecord(data: any, api: string){
    return this.http.put(this.baseUrl + api, [data]).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

}
