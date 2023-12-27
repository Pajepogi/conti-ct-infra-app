import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphApiService {
  private graphApiForUsers = "https://graph.microsoft.com/v1.0/8d4b558f-7b2e-40ba-ad1f-e04d79e6265a/users";

  constructor(private http: HttpClient) {

  }

  FetchUsers(upn: string, mail: string): Observable<any> {
    let queryFilters : string = '';
    let queryFiltersForMail: string = '';
    if (mail) {
      queryFiltersForMail = `mail eq '${mail}'`;
    }

    let queryFiltersForUpn: string = '';
    if (upn) {
      queryFiltersForUpn = `startsWith(userPrincipalName, '${upn}')`;
    }

    if(!queryFiltersForMail  && !queryFiltersForUpn)
    {
      throw new Error("UPN and Mail both cannot be empty.")
    }

    if(queryFiltersForMail && queryFiltersForUpn)
    {
      queryFilters = queryFiltersForMail.concat(' or ').concat(queryFiltersForUpn);
    }
    else if(queryFiltersForMail)
    {
      queryFilters = queryFiltersForMail;
    }
    else{
      queryFilters = queryFiltersForUpn;
    }

    const selectFilters = 'displayName,mail,userPrincipalName';
    return this.http.get<Object>(this.graphApiForUsers, {
      params: {
        $select: selectFilters,
        $filter: queryFilters
      }
    });
  }
}


