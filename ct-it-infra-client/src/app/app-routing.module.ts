import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomeModule),
	},
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	 },
	 {
		path: 'user',
		loadChildren: () =>
			import('./user-master/user-master.module').then((m) => m.UserMasterModule),
	},
	
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		// Don't perform initial navigation in iframes or popups
	   initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
	  })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
