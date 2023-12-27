import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { SiteNoticeComponent } from './site-notice/site-notice.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SharedModule } from '../shared/shared.module';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
	{
		path: 'footer/app-cookie-policy',
		component: CookiePolicyComponent
	},
	{
		path: 'footer/app-site-notice',
		component: SiteNoticeComponent
	},
	{
		path: 'footer/app-legal-notice',
		component: LegalNoticeComponent
	},
	{
		path: 'footer/app-terms-conditions',
		component: TermsConditionsComponent
	},
	{
		path: 'footer/app-privacy-policy',
		component: PrivacyPolicyComponent
	},
	{
		path: '**',
		component: PageNotFoundComponent
	}
	
];

@NgModule({
	declarations: [],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	exports: [RouterModule]
})
export class FooterRoutingModule {}
