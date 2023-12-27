import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhysicalStoragesService {
  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {}
  getPhysicalStorages(pageNo: number, pageSize: number , locCode: Number) {
    return this.http.get(this.baseUrl + 'PhysicalStorage?pageNumber=' + pageNo + '&pageSize=' + pageSize  
    + '&loc_code=' + locCode, { 'headers': this.headers }).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  } 

  savePhysicalStorage(physicalStorageData:any){
    return this.http.post(this.baseUrl + 'PhysicalStorage', physicalStorageData, {'headers': this.headers}).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    )
  }

  updatePhysicalStorage(physicalStorageData: any){
    return this.http.put(this.baseUrl + 'PhysicalStorage', physicalStorageData, {'headers': this.headers}).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    )
  }

  deletePhysicalStorage(physicalStorageData:any){
    const options = {
      headers: this.headers,
      body: physicalStorageData,
    };
    return this.http.delete(this.baseUrl + 'PhysicalStorage', options).pipe(
      map(res =>  of(true)),
      catchError(err => of(false))
    );
  }

  getSearchPhysicalStorage(pageNo: number, pageSize: number, locCode: Number, searchData:any){
    console.log(searchData)
    return this.http.get(this.baseUrl + 'PhysicalStorage?pageNumber=' 
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
    return this.http.get(this.baseUrl + 'PhysicalStorage?pageNumber=' 
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
