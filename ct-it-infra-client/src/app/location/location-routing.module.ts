import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddNewLocationComponent } from './add-new-location/add-new-location.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationComponent } from './location.component';
import { PhysicalServersComponent } from './physical-servers/physical-servers.component';
import { VirtualServersComponent } from './virtual-servers/virtual-servers.component';
import { PhysicalStoragesComponent } from './physical-storages/physical-storages.component';
import { TechnicalContactsComponent } from './technical-contacts/technical-contacts.component';
import { UserListComponent } from '../user-master/user-list/user-list.component';
import { SubnetsComponent } from './subnets/subnets.component';
import { CategoryComponent } from '../settings/category/category.component';
import { OperatingSystemComponent } from '../settings/operating-system/operating-system.component';
import { PatchingDaysComponent } from '../settings/patching-days/patching-days.component';
import { ViewLocationComponent } from './view-location/view-location.component';
import { MsalGuard } from '@azure/msal-angular';


const routes: Routes = [
	{
		path: 'pages',
		component: LocationComponent,
		canActivate : [MsalGuard],
		children: [
			{
				path: '',
				component: LocationListComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'locationlist',
				component: LocationListComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'addnewlocation',
				component: AddNewLocationComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'editlocation/:id',
				component: AddNewLocationComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'viewlocation/:id',
				component: ViewLocationComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'physicalServer',
				component: PhysicalServersComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'virtualServer',
				component: VirtualServersComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'physicalStorages',
				component: PhysicalStoragesComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'subnet',
				component: SubnetsComponent,
				canActivate : [MsalGuard]				
			},
			{
				path: 'technicalContact',
				component: TechnicalContactsComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'userlist',
				component: UserListComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'user',
				component: UserListComponent,
				canActivate : [MsalGuard]
			},
			{
				path: 'patchingDay',
				component: PatchingDaysComponent,
				canActivate : [MsalGuard]
			  },
			  {
				path: 'operatingSystem',
				component: OperatingSystemComponent,
				canActivate : [MsalGuard]
			  },
			  {
				path : 'category',
				component: CategoryComponent,
				canActivate : [MsalGuard]
			  },
			  {
				path : 'profile',
				component: CategoryComponent,
				canActivate : [MsalGuard]
			  },
		]
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LocationRoutingModule { }
