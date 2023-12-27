import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { GetLocationInterface, regions, users } from '../interfaces/getLocation.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private baseUrl: string = environment.gatewayURL;
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
  editRowData: any;
  constructor(private http: HttpClient) {
    console.log("this.baseUrl")
    console.log(this.baseUrl)
   }


  fetchLocations(pageNo: number, pageSize: number, action: string, searchParam: string) {
    return this.http.get<GetLocationInterface>(this.baseUrl + 'Location/?pageNumber=' + pageNo + '&PageSize=' + pageSize + '&action=' + action + '&searchParam=' + searchParam, { 'headers': this.headers }).pipe(
      map(resp => resp),
      catchError(err => of(false))
    );
  }

  addLocation(location: any) {
    return this.http.post(this.baseUrl + 'Location', location, { 'headers': this.headers }).pipe(
      map(resp => resp),
      catchError(err => of(err))
    );
  }

  updateLocation(location: any) {
    return this.http.put(this.baseUrl + 'Location', location, { 'headers': this.headers }).pipe(
      map(resp => of(true)),
      catchError(err => of(false))
    );
  }

  fetchRegions() {
    return this.http.get<regions>(this.baseUrl + 'Region', { 'headers': this.headers })
      .pipe(tap(res => console.log(res)))
  }

  deleteLocation(deleteLoc: any) {
    const options = {
      headers: this.headers,
      body: deleteLoc,
    };
    return this.http.delete(this.baseUrl + 'Location', options).pipe(
      map(res => of(true)),
      catchError(err => of(false))
    );
  }

  fetchCategories(pageNo: number, pageSize: number){
    return this.http.get<any>(this.baseUrl + 'Category/?pageNumber=' + pageNo + '&PageSize=' + pageSize, { 'headers': this.headers })
     .pipe(
      map(resp => resp.data),
      catchError(err => of(false))
      )
   }

   fetchPatchingDays(pageNo: number, pageSize: number){
    return this.http.get<any>(this.baseUrl + 'PatchingDay/?pageNumber=' + pageNo + '&PageSize=' + pageSize, { 'headers': this.headers })
     .pipe(
      map(resp => resp.data),
      catchError(err => of(false))
      )
   }

  fetchOsVersions(pageNo: number, pageSize: number){
    return this.http.get<any>(this.baseUrl + 'OS/?pageNumber=' + pageNo + '&PageSize=' + pageSize, { 'headers': this.headers })
     .pipe(
      map(resp => resp.data),
      catchError(err => of(false))
      )
   }

}
