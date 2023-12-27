import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { UserListComponent } from '../user-master/user-list/user-list.component';
import { CategoryComponent } from './category/category.component';
import { OperatingSystemComponent } from './operating-system/operating-system.component';
import { PatchingDaysComponent } from './patching-days/patching-days.component';
import { SettingComponent } from './setting.component';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingComponent,
    canActivate : [MsalGuard],
    children:[
      {
        path: '',
        component: SettingComponent,
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
        path: 'user',
        component: UserListComponent,
        canActivate : [MsalGuard]
      },{
        path : 'category',
        component: CategoryComponent,
        canActivate : [MsalGuard]
      },{
        path : 'profile',
        component: CategoryComponent,
        canActivate : [MsalGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
