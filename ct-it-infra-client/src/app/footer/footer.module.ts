import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterRoutingModule } from './footer-routing.module';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { FooterComponent } from './footer.component';
import { SharedModule } from '../shared/shared.module';
import { SiteNoticeComponent } from './site-notice/site-notice.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';



@NgModule({
  declarations: [
    FooterComponent,
    CookiePolicyComponent,
    SiteNoticeComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent
  ],
  imports: [
    CommonModule, SharedModule, FooterRoutingModule

  ],
  exports: [FooterComponent,CookiePolicyComponent]
})
export class FooterModule { }
