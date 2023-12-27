import { AuthenticationResult } from "@azure/msal-browser";
import { Observable } from "rxjs";
import { UserClaims } from "../shared/UserClaims";
import { AuthorizeInterface } from "./authorize-interface";

export interface AuthorizationServiceInterface {
    //Authorize(authenticationResult : AuthenticationResult): void;
    Authorize(authenticationResult : AuthenticationResult): Observable<any>;
    get UserClaims() : UserClaims;
    get UserRoles() : Observable<AuthorizeInterface>;
    setUserRoles(user:AuthorizeInterface):void;
}


