import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MsalGuard } from "@azure/msal-angular";
import { UserListComponent } from "./user-list/user-list.component";
import { UserComponent } from "./user.component";

const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        canActivate : [MsalGuard],
        children: [
            {
                path: 'user',
                component: UserListComponent,
                canActivate : [MsalGuard]
            },
            {
                path: 'userlist',
                component: UserListComponent,
                canActivate : [MsalGuard]
            }
        ]
    }
]

@NgModule({
imports:[RouterModule.forChild(routes)],
exports:[RouterModule],
})

export class UserRoutingModule{

}