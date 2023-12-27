import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { SwitchesInterface } from '../interfaces/Switches.Interface';
import { ConnectionTypeInterface } from '../interfaces/ConnectionType.Interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SwitchesService {

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  editRowData: any;

constructor(private http: HttpClient) { }
getSwitches(pageNo: number, pageSize: number, locCode: Number) {
  return this.http.get<SwitchesInterface>(this.baseUrl + 'Switches?pageNumber=' + pageNo + '&PageSize=' + pageSize + '&loc_code=' + locCode, { 'headers': this.headers }).pipe(
    map(resp => resp),
    catchError(err => of(false))
  );
}

getSearchSwitches(pageNo: number, pageSize: number, locCode: Number, searchData:any){
  console.log(searchData)
  return this.http.get(this.baseUrl + 'Switches?pageNumber=' 
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
  return this.http.get(this.baseUrl + 'Switches?pageNumber=' 
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
