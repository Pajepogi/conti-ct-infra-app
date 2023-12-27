import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import { SharedModule } from '../shared/shared.module';
import { LocationListComponent } from './location-list/location-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { AddNewLocationComponent } from './add-new-location/add-new-location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectOptionChangeDirective } from './directive/select-option-change.directive';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { PhysicalServersComponent } from './physical-servers/physical-servers.component';
import { MatSortModule } from '@angular/material/sort';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import { VirtualServersComponent } from './virtual-servers/virtual-servers.component';
import { SwitchesComponent } from './switches/switches.component';
// import { AddNewSwitchComponent } from './switches/add-new-switch/add-new-switch.component';
import { PhysicalStoragesComponent } from './physical-storages/physical-storages.component';
import { SubnetsComponent } from './subnets/subnets.component';
import { TechnicalContactsComponent } from './technical-contacts/technical-contacts.component';
import { TapeUnitComponent } from './tape-unit/tape-unit.component';
import { DiskBackupComponent } from './disk-backup/disk-backup.component';
import { SettingsModule } from '../settings/setting.module';
import { SettingComponent } from '../settings/setting.component';
import { CloudStorageContainersComponent } from './cloud-storage-containers/cloud-storage-containers.component';
import { CloudStorageComponent } from './cloud-storage/cloud-storage.component';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import { ViewLocationComponent } from './view-location/view-location.component';
@NgModule({
  declarations: [
    LocationComponent,
    LocationListComponent,
    DashboardComponent,
    AddNewLocationComponent,
    SelectOptionChangeDirective,
    PhysicalServersComponent,
    VirtualServersComponent,
    SwitchesComponent,
    PhysicalStoragesComponent,
    SubnetsComponent,
    TechnicalContactsComponent,
    TapeUnitComponent,
    DiskBackupComponent,
    CloudStorageComponent,
    CloudStorageContainersComponent,
    ViewLocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
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
    MatSnackBarModule,
    MatExpansionModule,
    MatSortModule,
    SettingsModule,
    MatSelectModule
  ]
})
export class LocationModule { }
