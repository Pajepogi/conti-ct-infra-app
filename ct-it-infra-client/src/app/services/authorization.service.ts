import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { AuthorizeInterface } from '../interfaces/authorize-interface';
import { AuthorizationServiceInterface } from '../interfaces/authorization-service-interface';
import { UserClaims } from '../shared/UserClaims';
import { environment } from 'src/environments/environment';
import { AuthenticationResult } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements AuthorizationServiceInterface {

  initdata: AuthorizeInterface = {
    UserId: '',
    RoleName: '',
    Permissions: []
  }
  private userType: BehaviorSubject<AuthorizeInterface> = new BehaviorSubject<AuthorizeInterface>(this.initdata);
  userRoles = this.userType.asObservable();
  authorizeResponse!: AuthorizeInterface;
  private authorizationApi = "Authorization";
  private _userClaims : UserClaims;

  get UserClaims()
  {
    return this._userClaims;
  }

  get UserRoles(): Observable<AuthorizeInterface> {
    return this.userType.asObservable();
  }

  setUserRoles(user: AuthorizeInterface) {
    this.userType.next(user);
 }
  constructor(private http: HttpClient) {
      //It will handle the refresh issue for all components
      var authToken = JSON.parse(sessionStorage.getItem("AuthToken")!);
      if(authToken){
        this.userType.next(authToken);
      }
  }

  // Authorize(authenticationResult: AuthenticationResult) {
  //     this.SetAuthorizationDetails(authenticationResult);
  // }

  Authorize(authenticationResult: AuthenticationResult): Observable<any> {
  let authorizationEndURL = "https://ct-it-infra-app-gateway.conti.de/api/" + this.authorizationApi;
  const username = authenticationResult.account?.username.split('@')[0]
  return this.http.get(authorizationEndURL + "/?userId=" + username).pipe(
      map(resp =>resp ),
      catchError(err => of(false))
    );
 }


  getAuthorizeResponse() {
    return this.authorizeResponse;
  }

  SetAuthorizationDetails(authenticationResult : AuthenticationResult) {
    let authorizationEndURL = "https://ct-it-infra-app-gateway.conti.de/api/" + this.authorizationApi;
    const username = authenticationResult.account?.username.split('@')[0]
    if(username)
    {
      this.http.get<AuthorizeInterface>(authorizationEndURL, { params : {
        userId : username
      }}).subscribe({
        next : (data:AuthorizeInterface) =>
        {
          this.authorizeResponse = data;
          sessionStorage.setItem("AuthToken", JSON.stringify(this.authorizeResponse));
          this.userType.next(this.authorizeResponse);
        },
        error : (err) => {console.error(err)}
      });
    }
    else{
      throw new Error("Username cannot be empty");
    }
  }
}


