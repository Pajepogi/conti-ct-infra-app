import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map , tap} from 'rxjs/operators';
import { of } from 'rxjs';
import { CloudStorageinterface } from '../interfaces/cloud-storage.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  editRowData: any;

constructor(private http: HttpClient) { }

getCloudStorage(pageNo: number, pageSize: number, locCode: Number) {
  return this.http.get<CloudStorageinterface>(this.baseUrl + 'CloudStorage?pageNumber=' + pageNo + '&PageSize=' + pageSize + '&loc_code=' + locCode).pipe(
    map(resp => resp),
    catchError(err => of(false))
   );
  }

  getSearchCloudStorage(pageNo: number, pageSize: number, locCode: Number, searchData:any){
    return this.http.get<CloudStorageinterface>(this.baseUrl + 'CloudStorage?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&backupjob=' + ''
     + '&name=' + searchData.name 
     + '&provider=' + ''  
     + '&purpose=' + '').pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

  searchCall(term: string,pageNo: number, pageSize: number, locCode: Number) {
    return this.http.get<CloudStorageinterface>(this.baseUrl + 'CloudStorage?pageNumber=' 
    + pageNo + '&PageSize=' 
    + pageSize + '&loc_code=' 
    + locCode + '&backupjob=' + ''
     + '&name=' + term 
     + '&provider=' + ''  
     + '&purpose=' + '').pipe(
      map(resp => resp),
      catchError(err => of(false))
     );
  }

}
