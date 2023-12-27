import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { VirtualServerInterface } from 'src/app/interfaces/virtual-server.interface';
import { VirtualServersService } from 'src/app/services/virtual-servers.service';
import { CategoryInterface } from 'src/app/interfaces/category-interface';
import { CommonDropdownService } from 'src/app/services/common-dropdown.service';
import { DaysOfWeek } from '../../shared/enums/dayOfWeek.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-virtual-servers',
  templateUrl: './virtual-servers.component.html',
  styleUrls: ['./virtual-servers.component.css']
})
export class VirtualServersComponent implements OnInit,AfterViewInit {

  @ViewChild(MatSort) matSort!: MatSort;

  displayedColumns = ['action', 'loC_ID', 'category', 'osVersion', 'patchingDate','name', 'purpose', 'type', 'ipAddress', 'hdd', 'ram', 'cpu'];
  displayedColumns1 = ['action','cpatchingDay', 'cname', 'cpurpose', 'ctype','ccategory', 'cosVersion','cipAddresss', 'chdd', 'cram', 'ccpu'];

  ELEMENT_DATA: VirtualServerInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  @Input() locationId: any;
  isExpanded: boolean= false;
  editRowData: any;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  dataSource: MatTableDataSource<VirtualServerInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  selectedCategory: number;
  selectedOS: number;
  selectedPatchingDay: number;
  selectedTechnicalContact: number;
  selectedVSType: number;

  categories: CategoryInterface[];
  osVersions: any;
  patchingDays: any;
  technicalContacts: any;
  vsTypes: any;
  searchReqObj: any;
  rearchResultTable: boolean = false;
  formSubmitAlert: boolean = false;
  addVirtualServerForm: FormGroup;
  searchVirtualServerForm: FormGroup;
  virtualServerId: number;
  locId: number;
  weekDay = DaysOfWeek;
  reqObj: any;
  message: string;
  baseUrl = environment.gatewayURL;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;
  @Input() isLocActive: boolean;

  constructor(private fb: FormBuilder,
    private virtualServerService: VirtualServersService,
    private authService: AuthorizationService,
    private dropdownService: CommonDropdownService,
    private http: HttpClient, private _snackBar: MatSnackBar) {
      this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if (this.userRole.toUpperCase() != "ADMIN") {
        this.deleteNoteVisibility = true;
      }
    }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;


    this.getCategoryDropDown();
    this.getOSDropdown();
    this.getPatDayDropdown();
    this.getTechDropDown();
    this.getTypeDropdown();

    this.addVirtualServerForm = this.fb.group({
      category: ['', Validators.required],
      osVersion: ['', Validators.required],
      patchingDay: ['', Validators.required],
      technicalContact: ['', Validators.required],
      type: ['', Validators.required],
      name: ['', Validators.required],
      purpose: ['', Validators.required],
      ipAddress: ['', Validators.required],
      hdd: ['', Validators.required],
      ram: ['', Validators.required],
      cpu: ['', Validators.required],
    });

    this.searchVirtualServerForm = this.fb.group({
      name: [''],
      osName: [''],
      categoryName: ['']
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

  getCategoryDropDown(){
    this.dropdownService.getDropdown('Category?pageNumber=1&pageSize=100').subscribe((res: any) => {
      this.categories = res.data;
      setTimeout(() => {
      });
    }, error => {
      console.log(error);
    });
  }

  getOSDropdown(){
    this.dropdownService.getDropdown('OS?pageNumber=1&pageSize=100').subscribe((res: any) => {
      this.osVersions = res.data;
      setTimeout(() => {
      });
    }, error => {
      console.log(error);
    });
  }

  getPatDayDropdown(){
    this.dropdownService.getDropdown('PatchingDay?pageNumber=1&pageSize=100').subscribe((res: any) => {
      this.patchingDays = res.data;
      setTimeout(() => {
      });
    }, error => {
      console.log(error);
    });
  }

  getTechDropDown(){
    this.dropdownService.getDropdown('TechnicalContact?pageNumber=1&pageSize=100&loc_code='+this.locationId).subscribe((res: any) => {
      this.technicalContacts = res.data;
      setTimeout(() => {
      });
    }, error => {
      console.log(error);
    });
  }

  getTypeDropdown(){
    this.http.get(this.baseUrl + 'VirtualServerType').subscribe((res) => {
      this.vsTypes = res;
    });
  }

  get category(): any { return this.addVirtualServerForm.get('category'); }
  get osVersion(): any { return this.addVirtualServerForm.get('osVersion'); }
  get technicalContact(): any { return this.addVirtualServerForm.get('technicalContact'); }
  get patchingDay(): any { return this.addVirtualServerForm.get('patchingDay'); }
  get type(): any { return this.addVirtualServerForm.get('type'); }
  get name(): any { return this.addVirtualServerForm.get('name'); }
  get purpose(): any { return this.addVirtualServerForm.get('purpose'); }
  get ipAddress(): any { return this.addVirtualServerForm.get('ipAddress'); }
  get hdd(): any { return this.addVirtualServerForm.get('hdd'); }
  get ram(): any { return this.addVirtualServerForm.get('ram'); }
  get cpu(): any { return this.addVirtualServerForm.get('cpu'); }

  toggle(){
    this.isExpanded = !this.isExpanded;
    if(this.isExpanded){
      this.loadData();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;

    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.matSort;
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

  loadData() {
    this.isLoading = true;
    let pageAdd = this.currentPage + 1;
    this.virtualServerService.getVirtualServers(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.totalRows = res.totalCount;
      this.dataSource.sort = this.matSort;
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

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
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
        this.virtualServerService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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
        // rest of your code
        event.preventDefault()
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetForm(form: FormGroup) {
		form.reset();
	}

  resetAddForm(){
    this.resetForm(this.addVirtualServerForm);
    this.virtualServerId=0
  }

  onFormSubmit() {
    if (this.addVirtualServerForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.reqObj = {
        id: this.virtualServerId,
        loC_ID: this.locationId,
        categoryID: this.addVirtualServerForm.value.category,
        operatingSystemId: this.addVirtualServerForm.value.osVersion,
        patchingDayId: this.addVirtualServerForm.value.patchingDay,
        virtualServerTypeID: this.addVirtualServerForm.value.type,
        technicalContactID: this.addVirtualServerForm.value.technicalContact,
        name: this.addVirtualServerForm.value.name,
        purpose: this.addVirtualServerForm.value.purpose,
        ipAddress: this.addVirtualServerForm.value.ipAddress,
        hdd: parseInt(this.addVirtualServerForm.value.hdd),
        ram: parseInt(this.addVirtualServerForm.value.ram),
        cpu: this.addVirtualServerForm.value.cpu
      }
      if(this.virtualServerId > 0){
        this.saveEdit();
      }else{
        this.saveAdd();
      }
    }
	}

  editVirtualServer(element: any) {
    this.virtualServerId = element.id;
    this.locId = element.loC_ID;

    this.addVirtualServerForm.controls['category'].setValue(element.categoryID);
    this.addVirtualServerForm.controls['osVersion'].setValue(element.operatingSystemId);
    this.addVirtualServerForm.controls['patchingDay'].setValue(element.patchingDayId);
    this.addVirtualServerForm.controls['technicalContact'].setValue(element.technicalContactID);
    this.addVirtualServerForm.controls['type'].setValue(element.virtualServerTypeID);
    this.addVirtualServerForm.controls['name'].setValue(element.name);
    this.addVirtualServerForm.controls['purpose'].setValue(element.purpose);
    this.addVirtualServerForm.controls['ipAddress'].setValue(element.ipAddress);
    this.addVirtualServerForm.controls['hdd'].setValue(element.hdd);
    this.addVirtualServerForm.controls['ram'].setValue(element.ram);
    this.addVirtualServerForm.controls['cpu'].setValue(element.cpu);
  }

  searchVirtualServers() {
    this.rearchResultTable = true;

    if (this.searchVirtualServerForm.status == 'INVALID') {
    } else {
      this.searchReqObj = {
        name: this.searchVirtualServerForm.value.name,
        OSname: this.searchVirtualServerForm.value.osName,
        categoryName: this.searchVirtualServerForm.value.categoryName,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.virtualServerService.getSearchVirtualServer(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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

  clearFormOnCancel() {
    this.rearchResultTable = false;
    this.searchVirtualServerForm.reset();
  }

  saveAdd(){
    this.virtualServerService.create(JSON.stringify(this.reqObj)).subscribe(res => {
      this.openSnackBar('Virtual Server has been Saved Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  saveEdit(){
    this.virtualServerService.update(this.reqObj).subscribe(res => {
      this.openSnackBar('Virtual Server has been Updated Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

   // Delete location functionality popup
   getRowData: any;
   deleteVirtualServer(rowData: any) {
     this.getRowData = rowData;
   }

   popupConfirmButton() {
     let deleteObj = {
       id: parseInt(this.getRowData.id),
       loC_ID: parseInt(this.getRowData.loC_ID),
       categoryID: parseInt(this.getRowData.categoryID),
       virtualServerId: parseInt(this.getRowData.virtualServerId),
       patchingDayId: parseInt(this.getRowData.patchingDayId),
       virtualServerTypeID: parseInt(this.getRowData.virtualServerTypeID),
       technicalContactID: parseInt(this.getRowData.technicalContactID),
       name: this.getRowData.name,
       purpose: this.getRowData.purpose,
       ipAddress: this.getRowData.ipAddress,
       hdd: parseInt(this.getRowData.hdd),
       ram: parseInt(this.getRowData.ram),
       cpu: this.getRowData.cpu
     }
     this.virtualServerService.delete(deleteObj).subscribe(data => {
      this.loadData();
      this.openSnackBar('Virtual Server has been Deleted Successfully');
     }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
     });
   }
 }
