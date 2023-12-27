import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicalContactService {

  private baseUrl: string = environment.gatewayURL + 'TechnicalContact';
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  //private baseUrl: string = 'https://localhost:7030/api/TechnicalContact';

  constructor(private http: HttpClient) {}

  getTechnicalContacts(pageNo: number, pageSize: number , locCode: Number) {
    return this.http.get(this.baseUrl + '?pageNumber=' + pageNo + '&pageSize=' + pageSize  
    + '&loc_code=' + locCode).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  } 

  create(data: any) {
    console.log('create service');
    console.log(data);
    return this.http.post(this.baseUrl, data, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  update(data: any){
    console.log('update service');
    console.log(data);
    return this.http.put(this.baseUrl, data, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  delete(data:any){
    console.log(data);
    const options = {
      headers: this.headers,
      body: data,
    };
    return this.http.delete(this.baseUrl, options).pipe(
      map(res =>  of(true)),
      catchError(err => of(false))
    );
  }

}
