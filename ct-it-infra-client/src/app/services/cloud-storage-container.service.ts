import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CloudStorageContainerInterface } from '../interfaces/cloud-storage-container.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudStorageContainerService {

  private baseUrl: string = environment.gatewayURL;
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
  editRowData: any;

  constructor(private http: HttpClient) { }

  getCloudContainers(pageNo: number, pageSize: number, locCode: Number) {
    return this.http.get<CloudStorageContainerInterface>(this.baseUrl + 'CloudContainer?pageNumber=' + pageNo + '&PageSize=' + pageSize + '&loc_code=' + locCode).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  }

  getSearchCloudStorageCont(pageNo: number, pageSize: number, locCode: Number, container?: any, purpose?:any) {
    return this.http.get<CloudStorageContainerInterface>(this.baseUrl + 'CloudContainer?pageNumber='
      + pageNo + '&PageSize='
      + pageSize + '&loc_code='
      + locCode + '&backupjob=' + ''
      + '&container=' + container
      + '&purpose=' + purpose).pipe(
        map(resp => resp),
        catchError(err => of(false))
      );
  }

  searchCall(term: string, pageNo: number, pageSize: number, locCode: Number) {
    return this.http.get<CloudStorageContainerInterface>(this.baseUrl + 'CloudContainer?pageNumber='
      + pageNo + '&PageSize='
      + pageSize + '&loc_code='
      + locCode + '&backupjob=' + ''
      + '&container=' + term
      + '&provider=' + ''
      + '&purpose=' + '').pipe(
        map(resp => resp),
        catchError(err => of(false))
      );
  }

}
