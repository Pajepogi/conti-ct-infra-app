import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { ConnectionTypeInterface } from '../interfaces/ConnectionType.Interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
constructor(private http: HttpClient) { }

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


addRecord(data: any, api: string) {
  return this.http.post(this.baseUrl + api , data, { 'headers': this.headers }).pipe(
    map(resp => of(true)),
    catchError(err => of(false))
  );
}

updateRecord(data: any, api: string){
  return this.http.put(this.baseUrl + api, data, { 'headers': this.headers }).pipe(
    map(resp => of(true)),
    catchError(err => of(false))
  );
}

deleteRecord(data: any, api: string){
  const options = {
    headers: this.headers,
    body: data,
  };
  return this.http.delete(this.baseUrl + api, options).pipe(
    map(res =>  of(true)),
    catchError(err => of(false))
  );
}

  fetchConnectionType(){
  return this.http.get<ConnectionTypeInterface>(this.baseUrl + 'ConnectionType')
   .pipe(tap(res => console.log(res)))
 }

}
