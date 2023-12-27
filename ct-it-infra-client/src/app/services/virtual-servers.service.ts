import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VirtualServersService {

  private baseUrl: string = environment.gatewayURL + 'VirtualServer';
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*')
  .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  .set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  //private baseUrl: string = 'https://localhost:7030/api/VirtualServer';

  constructor(private http: HttpClient) {}

  getVirtualServers(pageNo: number, pageSize: number , locCode: Number) {
    return this.http.get(this.baseUrl + '?pageNumber=' + pageNo + '&pageSize=' + pageSize  
    + '&loc_code=' + locCode).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  } 

  create(data: any) {
    return this.http.post(this.baseUrl, data, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  update(data: any){
    return this.http.put(this.baseUrl, data, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  delete(data:any){
    const options = {
      headers: this.headers,
      body: data,
    };
    return this.http.delete(this.baseUrl, options).pipe(
      map(res =>  of(true)),
      catchError(err => of(false))
    );
  }

  getSearchVirtualServer(pageNo: number, pageSize: number, locCode: Number, searchData:any){
    return this.http.get(this.baseUrl + '?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&name=' + searchData.name 
     + '&OSname=' + searchData.OSname  
     + '&categoryName=' + searchData.categoryName
     ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

  searchCall(term: string,pageNo: number, pageSize: number, locCode: Number) {
    return this.http.get(this.baseUrl + '?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&name=' + term 
    + '&OSname=' + '' 
    + '&categoryName=' + ''
     ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

}
