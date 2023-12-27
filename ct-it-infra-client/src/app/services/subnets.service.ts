import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubnetsService {
  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient) {}
  getSubnets(pageNo: number, pageSize: number , locCode: Number) {
    return this.http.get(this.baseUrl + 'Subnet?pageNumber=' + pageNo + '&pageSize=' + pageSize  
    + '&loc_code=' + locCode, { 'headers': this.headers }).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  } 

  addSubnet(subnetData:any){
    return this.http.post(this.baseUrl + 'Subnet', subnetData, {'headers': this.headers}).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    )
  }

  updateSubnet(subnetData: any){
    return this.http.put(this.baseUrl + 'Subnet', subnetData, {'headers': this.headers}).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    )
  }

  deleteSubnet(subnetData:any){
    const options = {
      headers: this.headers,
      body: subnetData,
    };
    return this.http.delete(this.baseUrl + 'Subnet', options).pipe(
      map(res =>  of(true)),
      catchError(err => of(false))
    );
  }

  getSearchVirtualServer(pageNo: number, pageSize: number, locCode: Number, searchData:any){
    console.log(searchData)
    return this.http.get(this.baseUrl + 'Subnet?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&subnet=' + searchData.subnet 
     ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

  searchCall(term: any,pageNo: number, pageSize: number, locCode: Number) {
    return this.http.get(this.baseUrl + 'Subnet?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&subnet=' + term 
     ).pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

}
