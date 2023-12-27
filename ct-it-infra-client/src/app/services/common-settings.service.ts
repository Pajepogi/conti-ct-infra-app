import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonSettingsService {

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  .set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  //private baseUrl: string = 'https://localhost:7030/api/';

  constructor(private http: HttpClient) {}

  getList(pageUrl: string, pageNo: number, pageSize: number) {
    return this.http.get(this.baseUrl + pageUrl + '?pageNumber=' + pageNo + '&pageSize=' + pageSize).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  } 

  create(pageUrl: string, data: any) {
    return this.http.post(this.baseUrl + pageUrl, data, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  update(pageUrl: string, data: any){
    console.log('update service');
    return this.http.put(this.baseUrl + pageUrl, data, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  delete(pageUrl: string, data:any){
    const options = {
      headers: this.headers,
      body: data,
    };
    return this.http.delete(this.baseUrl + pageUrl, options).pipe(
      map(res =>  of(true)),
      catchError(err => of(false))
    );
  }

  getSearch(pageUrl: string, pageNo: number, pageSize: number, patchdayosname:any, zonetimeosversion:any, PatchDayOSName:string, zoneTImeOSVersion:string){
    return this.http.get(this.baseUrl + pageUrl + '?pageNumber=' + pageNo + '&PageSize=' + pageSize + '&' + PatchDayOSName +'=' + patchdayosname 
     + '&'+ zoneTImeOSVersion +'=' + zonetimeosversion)
     .pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

  searchCall(pageUrl: string,pageNo: number, pageSize: number,term: string,PatchDayOSName:string, zoneTImeOSVersion:string) {
    return this.http.get(this.baseUrl + pageUrl +'?pageNumber=' + pageNo + '&PageSize=' + pageSize + '&' + PatchDayOSName +'=' + term 
    + '&'+ zoneTImeOSVersion +'=' + ''
    ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

}
