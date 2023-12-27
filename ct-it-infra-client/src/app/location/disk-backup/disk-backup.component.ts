import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DiskBackupInterface } from 'src/app/interfaces/disk-backup.Interface';
import { DiskBackupService } from 'src/app/services/disk-backup.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-disk-backup',
  templateUrl: './disk-backup.component.html',
  styleUrls: ['./disk-backup.component.css']
})
export class DiskBackupComponent implements OnInit, AfterViewInit {
  @Input() isLocActive: boolean;
  addNewDiskBackUpForm: FormGroup;
  connectionTypeDropdown: any;

  saveObj: any;
  diskId: number = 0;
  api: string = "Diskbackup";

  displayedColumns = ['action', 'name', 'connectionType', 'firmware_Version', 'model', 'pn',
  'sn', 'carePackSAID', 'validContractThru', 'ipAddress', 'ipAddress2', 'cbLicense'];
  displayedColumns1 = ['action', 'cname', 'cconnectiontype', 'cfirmwareversion', 'cmodel',
  'cpn', 'csn', 'ccarepacksaid', 'cvaliduntil','cipAddress','cipAddress2','ccblicense'];
  ELEMENT_DATA: DiskBackupInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  show: boolean = true;
  searchReqObj: any;
  rearchResultTable: boolean = false;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  @Input() locationId: any;
  @Input() locName: any;
  isExpanded: boolean= false;
  searchDiskBackupForm: any;
  dataSource: MatTableDataSource<DiskBackupInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<DiskBackupInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;

  constructor(private fb: FormBuilder,
    private diskBackupService: DiskBackupService,
    private commonService: CommonService,
    private authService: AuthorizationService,
    private route: ActivatedRoute, private router: Router,
    private _snackBar: MatSnackBar
    ) {

      this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if (this.userRole.toUpperCase() != "ADMIN") {
        this.deleteNoteVisibility = true;
      }
    }

    cbLicenseDropdown = [
      { name: "Yes" },
      { name: "No" },
    ]

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.addNewDiskBackUpForm = this.fb.group({
      locationName:[''],
      name: [''],
      firmware_Version: ['',Validators.required],
      model: [''],
      pn: ['',Validators.required],
      sn: ['',Validators.required],
      carePackSAID: [''],
      validContractThru: [''],
      ipAddress: ['',Validators.required],
      ipAddress2: ['',Validators.required],
      cbLicense: ['No'],
      connectionType: ['']
    });

    this.searchDiskBackupForm = this.fb.group({
      name: [''],
      pn: [''],
      sn: [''],
      ipaddress: ['']
    });

    this.commonService.fetchConnectionType().subscribe(connectionTypeData => {
      this.connectionTypeDropdown = connectionTypeData;
    });
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getRangeDisplayText = (page: number, pageSize: number, length: number) => {
    const initialText = `Showing `;
    const endText = 'entries';
    if (length == 0 || pageSize == 0) {
      return `${initialText} 0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `${initialText} ${startIndex + 1} to ${endIndex} of ${length} ${endText}`;
  };

  toggle(){
    this.isExpanded = !this.isExpanded;
    if(this.isExpanded){
      this.loadData();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  loadData(){
    this.isLoading = true;
    let pageAdd = this.currentPage + 1;
    this.diskBackupService.getDiskBackUp(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.totalRows = res.totalCount;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.totalCount;
      });
      this.isLoading = false;
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
      this.isLoading = false;
    });
  }

    //Clear objects for new switches
    createDiskBackup(){
      this.diskId = 0;
      this.addNewDiskBackUpForm.get('locationName')?.setValue(this.locName);
      this.addNewDiskBackUpForm.get('name')?.setValue('');
      this.addNewDiskBackUpForm.get('firmware_Version')?.setValue('');
      this.addNewDiskBackUpForm.get('model')?.setValue('');
      this.addNewDiskBackUpForm.get('pn')?.setValue('');
      this.addNewDiskBackUpForm.get('sn')?.setValue('');
      this.addNewDiskBackUpForm.get('carePackSAID')?.setValue('');
      this.addNewDiskBackUpForm.get('validContractThru')?.setValue('');
      this.addNewDiskBackUpForm.get('ipAddress')?.setValue('');
      this.addNewDiskBackUpForm.get('ipAddress2')?.setValue('');
      this.addNewDiskBackUpForm.get('cbLicense')?.setValue('No');
      this.addNewDiskBackUpForm.get('connectionType')?.setValue('');
    }

      //Getting acces to form control for validation
      get locationName(): any { return this.addNewDiskBackUpForm.get('locationName'); }
      get name(): any { return this.addNewDiskBackUpForm.get('name'); }
      get firmware_Version(): any { return this.addNewDiskBackUpForm.get('firmware_Version'); }
      get connectionType(): any { return this.addNewDiskBackUpForm.get('connectionType');}
      get model(): any { return this.addNewDiskBackUpForm.get('model'); }
      get pn(): any { return this.addNewDiskBackUpForm.get('pn'); }
      get sn(): any { return this.addNewDiskBackUpForm.get('sn'); }
      get carePackSAID(): any { return this.addNewDiskBackUpForm.get('carePackSAID'); }
      get validContractThru(): any { return this.addNewDiskBackUpForm.get('validContractThru'); }
      get ipAddress(): any { return this.addNewDiskBackUpForm.get('ipAddress'); }
      get ipAddress2(): any { return this.addNewDiskBackUpForm.get('ipAddress2'); }
      get cbLicense(): any { return this.addNewDiskBackUpForm.get('cbLicense'); }

  saveDiskBackUp(){
    this.saveObj = {
      id: this.diskId,
      id_location: this.locationId,
      name: this.addNewDiskBackUpForm.value.name,
      firmware_Version: this.addNewDiskBackUpForm.value.firmware_Version,
      connectionTypeId: parseInt(this.addNewDiskBackUpForm.value.connectionType.id),
      model: this.addNewDiskBackUpForm.value.model,
      pn: this.addNewDiskBackUpForm.value.pn,
      sn: this.addNewDiskBackUpForm.value.sn,
      carePackSAID: this.addNewDiskBackUpForm.value.carePackSAID,
      validContractThru: this.addNewDiskBackUpForm.value.validContractThru,
      ipAddress: this.addNewDiskBackUpForm.value.ipAddress,
      ipAddress2: this.addNewDiskBackUpForm.value.ipAddress2,
      cbLicense: (this.addNewDiskBackUpForm.value.cbLicense == 'Yes' ? true : false),
    }

    if(this.diskId == 0){
      this.addDiskBackUp(this.saveObj);
    }else{
      this.updateDiskBackUp(this.saveObj);
    }
  }

      addDiskBackUp(reqObj: any) {
        this.commonService.addRecord(reqObj,this.api).subscribe(res => {
          this.openSnackBar('Disk Backup Unit has been Saved Successfully');
          this.loadData();
        }, error => {
          this.openSnackBar('Something went wrong. Please try after some time');
        })
        this.addNewDiskBackUpForm.reset();
      }

         updateDiskBackUp(reqObj: any) {
          this.commonService.updateRecord(reqObj,this.api).subscribe(res => {
              this.openSnackBar('Disk Backup Unit has been Updated Successfully');
              this.loadData();
            }, error => {
              this.openSnackBar('Something went wrong. Please try after some time');
          })
          this.addNewDiskBackUpForm.reset();
        }


           editLocation(row: DiskBackupInterface) {

            this.diskId = row.id;
            this.addNewDiskBackUpForm.get('locationName')?.setValue(this.locName);
            this.addNewDiskBackUpForm.get('name')?.setValue(row.name);
            this.addNewDiskBackUpForm.get('firmware_Version')?.setValue(row.firmware_Version);
            this.addNewDiskBackUpForm.get('model')?.setValue(row.model);
            this.addNewDiskBackUpForm.get('pn')?.setValue(row.pn);
            this.addNewDiskBackUpForm.get('sn')?.setValue(row.sn);
            this.addNewDiskBackUpForm.get('carePackSAID')?.setValue(row.carePackSAID);
            this.addNewDiskBackUpForm.get('validContractThru')?.setValue(formatDate(row.validContractThru,'yyyy-MM-dd','en'));
            this.addNewDiskBackUpForm.get('ipAddress')?.setValue(row.ipAddress);
            this.addNewDiskBackUpForm.get('ipAddress2')?.setValue(row.ipAddress2);
            let connTypeValue = this.connectionTypeDropdown.filter((e: any) => e.id == row.connectionTypeId);
            this.addNewDiskBackUpForm.controls['connectionType'].setValue(connTypeValue[0]);
            this.addNewDiskBackUpForm.controls['cbLicense'].setValue((row.cbLicense.toString() == 'true' ? 'Yes' : 'No'));
          }

   getRowLocData: any;
   deleteLocation(rowData: any) {
     this.getRowLocData = rowData;
   }

  popupConfirmButton() {
    let deleteObj = {
      Id: parseInt(this.getRowLocData.id),
      id_Location: this.getRowLocData.id_Location,
      name: this.getRowLocData.name,
      firmware_Version: this.getRowLocData.firmware_Version,
      connectionTypeId: this.getRowLocData.connectionTypeId,
      pn: this.getRowLocData.pn,
      sn: this.getRowLocData.sn,
      model: this.getRowLocData.model,
      carePackSAID: this.getRowLocData.carePackSAID,
      validContractThru: this.getRowLocData.validContractThru,
      ipAddress: this.getRowLocData.ipAddress,
      ipAddress2: this.getRowLocData.ipAddress2,
      cbLicense: this.getRowLocData.cbLicense
    }
    this.commonService.deleteRecord(deleteObj,this.api).subscribe(deleteLoc => {
      this.openSnackBar('Disk Backup Unit has been Deleted Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  clearFormOnCancel() {
    this.rearchResultTable = false;
    this.addNewDiskBackUpForm.reset();
    this.searchDiskBackupForm.reset();
  }

  onInputChange(event: any) {
    if (event.target.value === '') {
      this.searchTerm = event.target.value;
      if (event.keyCode === 13) {
        event.preventDefault()
      }
    } else {
      this.loadData()
    }
  }

  keyDownFunction(event: any) {
    this.isLoading = true;
    let pageAdd = this.currentPage + 1;
    this.searchTerm = this.searchText.nativeElement.value;
    if (this.searchTerm === '') {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    }

    if (this.searchTerm !== '') {
      if (event.keyCode === 13) {
        this.diskBackupService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
          this.dataSource.data = res.data;
          this.totalRows = res.totalCount;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = res.totalCount;
          });
          this.isLoading = false;
        }, error => {
          this.openSnackBar('Something went wrong. Please try after some time');
          this.isLoading = false;
        });
        event.preventDefault()
      }
    }
  }

  searchDiskBackup() {
    this.rearchResultTable = true;

    if (this.searchDiskBackupForm.status == 'INVALID') {
    } else {
      this.searchReqObj = {
        name: this.searchDiskBackupForm.value.name,
        pn: this.searchDiskBackupForm.value.pn,
        sn: this.searchDiskBackupForm.value.sn,
        ipAddress: this.searchDiskBackupForm.value.ipaddress,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.diskBackupService.getSearchDiskBackup(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
        this.dataSource1.data = res.data;
        this.totalRows = res.totalCount;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = res.totalCount;
        });
        this.isLoading = false;
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
        this.isLoading = false;
      });
    }
  }


}
