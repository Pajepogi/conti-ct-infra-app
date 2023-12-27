import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterModule } from './footer/footer.module';
import { HomeModule } from './home/home.module';
import { LocationModule } from './location/location.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHttpInterceptor } from './shared/interceptors/error-http-interceptor';
import { AuthHttpInterceptor } from './shared/interceptors/auth-http-interceptor';
import { SettingsModule } from './settings/setting.module';
import { UserMasterModule } from './user-master/user-master.module';
import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor  } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const interceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorHttpInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
];


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    LocationModule,
    SettingsModule,
    FooterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UserMasterModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.azureAdClientId,
        authority: environment.authority,
        redirectUri: environment.redirectUrl
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([ 
          ['https://graph.microsoft.com/v1.0/8d4b558f-7b2e-40ba-ad1f-e04d79e6265a', ['user.read.all']]
      ])
    })
  ],
  providers: [interceptorProviders, MsalGuard],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
