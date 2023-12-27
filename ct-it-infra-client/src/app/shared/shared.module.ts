import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { DropdownDirective } from './directive/dropdown.directive';
import { SubmenuColorChangeDirective } from './directive/submenu-color-change.directive';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NotificationComponent } from './components/header/notification/notification.component';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { ContactsComponent } from './components/header/contacts/contacts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    PageNotFoundComponent,
    HeaderComponent,
    DropdownDirective,
    SubmenuColorChangeDirective,
    NotificationComponent,
    ContactsComponent,
  ],
  imports: [
    CommonModule,
    MatBadgeModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [
    HeaderComponent,
    DropdownDirective,
    SubmenuColorChangeDirective,
    NotificationComponent,
    ContactsComponent,
    RouterModule
  ]
})
export class SharedModule { }
