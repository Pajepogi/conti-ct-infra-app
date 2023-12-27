import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './setting-routing.module';
import { PatchingDaysComponent } from './patching-days/patching-days.component';
import { SettingComponent } from './setting.component';
import { SharedModule } from '../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import { OperatingSystemComponent } from './operating-system/operating-system.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [
    SettingComponent,
    PatchingDaysComponent,
    OperatingSystemComponent,
    CategoryComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
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
    MatSortModule,
    MatExpansionModule
  ],
  exports:[SettingComponent]
})
export class SettingsModule { }
