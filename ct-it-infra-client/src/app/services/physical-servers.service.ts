import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhysicalServersService {

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {}
  getPhysicalServers(pageNo: number, pageSize: number , locCode: Number) {
    return this.http.get(this.baseUrl + 'PhysicalServer?pageNumber=' + pageNo + '&pageSize=' + pageSize  
    + '&loc_code=' + locCode, { 'headers': this.headers }).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  } 

  savePhysicalServer(physicalServerData:any){
    return this.http.post(this.baseUrl + 'PhysicalServer', physicalServerData, {'headers': this.headers}).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    )
  }

  updatePhysicalServer(physicalServerData: any){
    return this.http.put(this.baseUrl + 'PhysicalServer', physicalServerData, {'headers': this.headers}).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    )
  }

  deletePhysicalServer(physicalServerData:any){
    const options = {
      headers: this.headers,
      body: physicalServerData,
    };
    return this.http.delete(this.baseUrl + 'PhysicalServer', options).pipe(
      map(res =>  of(true)),
      catchError(err => of(false))
    );
  }

  getSearchPhysicalServer(pageNo: number, pageSize: number, locCode: Number, searchData:any){
    console.log(searchData)
    return this.http.get(this.baseUrl + 'PhysicalServer?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&name=' + searchData.name 
     + '&pn=' + searchData.pn  
     + '&sn=' + searchData.sn
     + '&ipAddress=' + searchData.ipAddress
     ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

  searchCall(term: string,pageNo: number, pageSize: number, locCode: Number) {
    return this.http.get(this.baseUrl + 'PhysicalServer?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&name=' + term 
    + '&pn=' + ''  
    + '&sn=' + ''
    + '&ipAddress=' + ''
     ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

}
