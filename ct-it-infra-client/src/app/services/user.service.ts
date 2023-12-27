import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { roles, userLocationData, users } from '../interfaces/getLocation.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.gatewayURL;
  headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  editRowData: any;

  constructor(private http: HttpClient) { }


  getUserList() : Observable<users[]>{
    // alert('inside service')
    return this.http.get<users[]>(this.baseUrl+ 'Authorization/All' ,{ 'headers': this.headers })
     .pipe(tap(res => console.log(res)))
  }

  getLocationForUsers(usersArray:users[]): Observable<userLocationData[]>{
    return this.http.post<userLocationData[]>(this.baseUrl+ 'TechnicalContact/GetLocByUser' ,usersArray, { 'headers': this.headers })
     .pipe(tap(res => console.log(res)))
   }

   getUserRoles(){
    return this.http.get<roles>(this.baseUrl+ 'Roles', {headers: this.headers})
    .pipe(tap( res => console.log('Roles' + res)))
   }

   deleteUser(userData:any){
    const options = {
      headers: this.headers,
      body: userData,
    };
    return this.http.delete(this.baseUrl + 'Authorization' , options)
    .pipe(tap(res => console.log(res)))
   }

   updateUser(userData:any){
    return this.http.put(this.baseUrl + 'Authorization' , userData,  {headers: this.headers})
    .pipe(tap(res => console.log(res)))
   }

   saveUser(userData:any){
    return this.http.post(this.baseUrl + 'Authorization' , userData,  {headers: this.headers})
    .pipe(tap(res => console.log(res)))
   }

}
