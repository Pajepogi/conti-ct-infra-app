import { Component, OnInit,OnDestroy,Inject   } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration   } from '@azure/msal-angular';
import { AuthorizationServiceInterface } from 'src/app/interfaces/authorization-service-interface';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  IsProcessing: boolean;
  Message: string;
  private authorizationService : AuthorizationServiceInterface;

  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private broadcastService: MsalBroadcastService,private router: Router, authorizeService: AuthorizationService,
    private authenticationService : MsalService) {
    this.authorizationService = authorizeService;
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.authenticationService.handleRedirectObservable().subscribe({
      next: (result) => {
        if(result){
          this.setLoginDisplay();
          this.Message = "Processing Single Sign-On";
          this.authorizationService.Authorize(result).subscribe(data => {
            if(data.UserId && data.RoleName){
              this.authorizationService.setUserRoles(data);
              sessionStorage.setItem("AuthToken", JSON.stringify(data));
              this.router.navigate(['/pages']);
            }else {
              this.Message = "You are not Authorized to access this website. Please contact ContiTech IT Server Team.";
            }
            this.IsProcessing = false;
          })

        }
      },
      error: (error) => console.log(error)
  })
  }

  login() {
    this.IsProcessing = true;
    this.authenticationService.loginRedirect();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authenticationService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
