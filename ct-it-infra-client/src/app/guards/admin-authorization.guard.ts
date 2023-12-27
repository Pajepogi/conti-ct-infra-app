import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockAuthorizationService } from '../services/mock-authorization.service';
import { Roles } from '../shared/enums/roles.model';

@Injectable({
  providedIn: 'root'
})

export class AdminAuthorizationGuard implements CanActivate {

  roles: string = '';

  constructor( private authorizeService: MockAuthorizationService,
                private router:Router){}

  canActivate(): Observable<boolean> | boolean {
    
    this.authorizeService.userRoles.subscribe(value => this.roles = value.RoleName);
    let roleToenum : Roles = (<any>Roles)[this.roles];
    if(roleToenum === Roles.ADMIN){
      return true;
    } else {
      this.router.navigateByUrl('/home');
      alert('Not an Authorized admin');
      return false;
    }
  }

}
