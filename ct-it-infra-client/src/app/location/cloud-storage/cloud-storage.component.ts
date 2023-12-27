import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { CloudStorageinterface } from 'src/app/interfaces/cloud-storage.interface';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';
import { CommonService } from 'src/app/services/common.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cloud-storage',
  templateUrl: './cloud-storage.component.html',
  styleUrls: ['./cloud-storage.component.css']
})
export class CloudStorageComponent implements OnInit {
  @Input() isLocActive: boolean;
  addNewCloudStorageForm: FormGroup;
  searchCloudStorageForm: FormGroup;
  saveObj: any;
  cloudId: number = 0;
  api: string = "CloudStorage";
  userRole: string = "";
  isDisable: boolean = false;
  @ViewChild('input') searchText: ElementRef;
  displayedColumns = ['action', 'name', 'purpose', 'provider', 'fqdn', 'amountTb'];
  displayedColumns1 = ['action', 'name', 'purpose', 'provider', 'fqdn', 'amounttb'];
  ELEMENT_DATA: CloudStorageinterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  show: boolean = true;
  searchReqObj: any;
  @Input() locationId: any;
  @Input() locName: any;
  isExpanded: boolean = false;
  searchTerm: any;
  rearchResultTable: boolean = false;
  dataSource: MatTableDataSource<CloudStorageinterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<CloudStorageinterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  
  constructor(private fb: FormBuilder,
    private cloudStorageService: CloudStorageService,
    private commonService: CommonService,
    private authService: AuthorizationService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
    if (this.userRole.toUpperCase() != "ADMIN") {
      this.isDisable = true;
    }

  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.addNewCloudStorageForm = this.fb.group({
      locationName: ['', Validators.required],
      name: ['', Validators.required],
      purpose: ['', Validators.required],
      provider: ['', Validators.required],
      fqdn: ['', ''],
      amountTb: ['', '']
    });

    this.searchCloudStorageForm = this.fb.group({
      name: [''],
      cloudPurpose: ['']
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

  toggle() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.loadData();
    }
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
        this.cloudStorageService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    let pageAdd = this.currentPage + 1;
    this.cloudStorageService.getCloudStorage(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  get locationName(): any { return this.addNewCloudStorageForm.get('locationName'); }
  get name(): any { return this.addNewCloudStorageForm.get('name'); }
  get cloudContainer(): any { return this.addNewCloudStorageForm.get('cloudContainer'); }
  get cloudPurpose(): any { return this.addNewCloudStorageForm.get('cloudPurpose'); }
  get purpose(): any { return this.addNewCloudStorageForm.get('purpose'); }
  get provider(): any { return this.addNewCloudStorageForm.get('provider'); }
  get fqdn(): any { return this.addNewCloudStorageForm.get('fqdn'); }
  get amountTb(): any { return this.addNewCloudStorageForm.get('amountTb'); }

  createCloudStorage() {
    this.cloudId = 0;
    this.addNewCloudStorageForm.get('locationName')?.setValue(this.locName);
    this.addNewCloudStorageForm.get('name')?.setValue('');
    this.addNewCloudStorageForm.get('purpose')?.setValue('');
    this.addNewCloudStorageForm.get('provider')?.setValue('');
    this.addNewCloudStorageForm.get('fqdn')?.setValue('');
    this.addNewCloudStorageForm.get('amountTb')?.setValue('');

  }

  saveCloudStorage() {
    this.saveObj = {
      id: this.cloudId,
      loC_ID: this.locationId,
      name: this.addNewCloudStorageForm.value.name,
      purpose: this.addNewCloudStorageForm.value.purpose,
      provider: this.addNewCloudStorageForm.value.provider,
      fqdn: this.addNewCloudStorageForm.value.fqdn,
      amountTb: +this.addNewCloudStorageForm.value.amountTb,
    }
    if (this.cloudId == 0) {
      this.addNewCloudStorage(this.saveObj);
    } else {
      this.updateCloudStorage(this.saveObj);
    }

  }

  addNewCloudStorage(reqObj: any) {
    this.commonService.addRecord(reqObj, this.api).subscribe(res => {
      this.openSnackBar('Cloud Storage has been Saved Successfully');
      setTimeout(() => {
        this.loadData();
      }, 1500)
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  updateCloudStorage(reqObj: any) {
    this.commonService.updateRecord(reqObj, this.api).subscribe(res => {
      this.openSnackBar('Cloud Storage has been Updated Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  editLocation(row: CloudStorageinterface) {
    this.cloudId = row.id;
    this.addNewCloudStorageForm.get('locationName')?.setValue(this.locName);
    this.addNewCloudStorageForm.get('name')?.setValue(row.name);
    this.addNewCloudStorageForm.get('purpose')?.setValue(row.purpose);
    this.addNewCloudStorageForm.get('provider')?.setValue(row.provider);
    this.addNewCloudStorageForm.get('fqdn')?.setValue(row.fqdn);
    this.addNewCloudStorageForm.get('amountTb')?.setValue(row.amountTb);

  }

  getRowLocData: any;
  deleteLocation(rowData: any) {
    this.getRowLocData = rowData;

  }

  popupConfirmButton() {

    let deleteObj = {
      Id: parseInt(this.getRowLocData.id),
      loc_id: this.getRowLocData.id_Location,
      name: this.getRowLocData.name,
      purpose: this.getRowLocData.purpose,
      provider: this.getRowLocData.provider,
      fqdn: this.getRowLocData.fqdn,
      amountTb: this.getRowLocData.amountTb
    }

    this.commonService.deleteRecord(deleteObj, this.api).subscribe(deleteLoc => {
      this.openSnackBar('Cloud Storage has been Deleted Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  clearFormOnCancel() {
    this.searchCloudStorageForm.reset();
    this.addNewCloudStorageForm.reset();
    this.rearchResultTable = false;
  }

  searchCloudStorage() {
    this.rearchResultTable = true;
    if (this.searchCloudStorageForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.searchReqObj = {
        name: this.searchCloudStorageForm.value.name,
        purpose: this.searchCloudStorageForm.value.cloudPurpose
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.cloudStorageService.getSearchCloudStorage(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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
