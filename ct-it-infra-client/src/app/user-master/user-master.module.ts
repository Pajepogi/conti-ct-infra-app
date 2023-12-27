import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserListComponent } from './user-list/user-list.component';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import { SettingsModule } from '../settings/setting.module';

@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    MatSnackBarModule,
    SettingsModule
  ]
})
export class UserMasterModule { }
