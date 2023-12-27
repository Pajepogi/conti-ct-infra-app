import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { PhysicalServerInterface } from 'src/app/interfaces/physical-server.interface';
import { PhysicalServersService } from 'src/app/services/physical-servers.service';
import { DaysOfWeek } from '../../shared/enums/dayOfWeek.model';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-physical-servers',
  templateUrl: './physical-servers.component.html',
  styleUrls: ['./physical-servers.component.css']
})
export class PhysicalServersComponent implements OnInit, AfterViewInit {

  searchPhysicalServerForm: FormGroup;
  createPhysicalServerForm: FormGroup;
  saveReqObj: any;
  updateReqObj:any;
  searchReqObj: any;
  rearchResultTable: boolean = false;
  getLocId: any;
  deletePhysicalServers: any;
  EdithysicalServerID:any;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;
  @Input() isLocActive: boolean;


  constructor(private physicalServer: PhysicalServersService,
    private authService: AuthorizationService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar) {
      this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if (this.userRole.toUpperCase() != "ADMIN") {
        this.deleteNoteVisibility = true;
      }
    }

  CCServerUserDropdown = [
    { name: "Yes" },
    { name: "No" },
  ]

  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['action', 'category', 'osVersion', 'patchingDate', 'name', 'pn',
    'sn', 'model', 'carePack', 'validUntil', 'ipAddr', 'iLoip', 'ccServerUser', 'hdd', 'ram', 'cpu'];

  displayedColumns1 = ['action', 'cid', 'clocation', 'ccategory', 'cosVersion', 'cname', 'cpn',
    'csn', 'cipAddr', 'chdd', 'cram', 'ccpu'];

  ELEMENT_DATA: PhysicalServerInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  @Input() locationId: any;
  weekDay = DaysOfWeek;
  isExpanded: boolean = false;

  dataSource: MatTableDataSource<PhysicalServerInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  categories: any = localStorage.getItem('categories');
  osVersions: any = localStorage.getItem('osVersions');
  patchingDays: any = localStorage.getItem('patchingDays');

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.searchPhysicalServerForm = this.fb.group({
      name: [''],
      pn: [''],
      sn: [''],
      ipaddress: ['']
    });

    this.createPhysicalServerForm = this.fb.group({
      cCategory: ['', Validators.required],
      cOsVersion: ['', Validators.required],
      cPatchingDay: ['', Validators.required],
      cCServerUser: ['', Validators.required],
      cPurpose: ['', Validators.required],
      cName: ['', Validators.required],
      cPns: ['', Validators.required],
      cSn: ['', Validators.required],
      cModel: ['', Validators.required],
      cCarePackSaid: ['', Validators.required],
      cValidUntil: ['', Validators.required],
      cIpAddress: ['', Validators.required],
      cIloIp: ['', Validators.required],
      cCpu: ['', Validators.required],
      cHdd: ['', Validators.required],
      cRam: ['', Validators.required],
    });
    this.categories = JSON.parse(this.categories)
    this.osVersions = JSON.parse(this.osVersions)
    this.patchingDays = JSON.parse(this.patchingDays)
    this.getLocId = localStorage.getItem('locId')
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

  get category(): any { return this.searchPhysicalServerForm.get('category'); }
  get pn(): any { return this.searchPhysicalServerForm.get('pn'); }
  get sn(): any { return this.searchPhysicalServerForm.get('sn'); }
  get ipaddress(): any { return this.searchPhysicalServerForm.get('ipaddress'); }
  get name(): any { return this.searchPhysicalServerForm.get('name'); }

  get cCategory(): any { return this.createPhysicalServerForm.get('cCategory'); }
  get cOsVersion(): any { return this.createPhysicalServerForm.get('cOsVersion'); }
  get cPatchingDay(): any { return this.createPhysicalServerForm.get('cPatchingDay'); }
  get cCServerUser(): any { return this.createPhysicalServerForm.get('cCServerUser'); }
  get cPurpose(): any { return this.createPhysicalServerForm.get('cPurpose'); }
  get cName(): any { return this.createPhysicalServerForm.get('cName'); }
  get cPns(): any { return this.createPhysicalServerForm.get('cPns'); }
  get cSn(): any { return this.createPhysicalServerForm.get('cSn'); }
  get cModel(): any { return this.createPhysicalServerForm.get('cModel'); }

  get cCarePackSaid(): any { return this.createPhysicalServerForm.get('cCarePackSaid'); }
  get cValidUntil(): any { return this.createPhysicalServerForm.get('cValidUntil'); }
  get cIpAddress(): any { return this.createPhysicalServerForm.get('cIpAddress'); }
  get cIloIp(): any { return this.createPhysicalServerForm.get('cIloIp'); }

  get cCpu(): any { return this.createPhysicalServerForm.get('cCpu'); }
  get cHdd(): any { return this.createPhysicalServerForm.get('cHdd'); }
  get cRam(): any { return this.createPhysicalServerForm.get('cRam'); }


  toggle() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
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
    this.physicalServer.getPhysicalServers(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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
        this.physicalServer.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
          this.dataSource.data = res.data;
          console.log(this.dataSource.data)
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
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  editPhyServ(row: any) {
    this.editPhysicalServer(row)
  }

  searchPhysicalServers() {
    this.rearchResultTable = true;

    if (this.searchPhysicalServerForm.status == 'INVALID') {
    } else {
      this.searchReqObj = {
        name: this.searchPhysicalServerForm.value.name,
        pn: this.searchPhysicalServerForm.value.pn,
        sn: this.searchPhysicalServerForm.value.sn,
        ipAddress: this.searchPhysicalServerForm.value.ipaddress,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.physicalServer.getSearchPhysicalServer(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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
    this.searchPhysicalServerForm.reset();
    this.createPhysicalServerForm.reset();
  }

  savePhysicalServers() {
    if (this.createPhysicalServerForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.saveReqObj = {
        locationID: +this.getLocId,
        categoryID: +this.createPhysicalServerForm.value.cCategory,
        operatingSystemId: +this.createPhysicalServerForm.value.cOsVersion,
        patchingDayID: +this.createPhysicalServerForm.value.cPatchingDay,
        ccServerUser: (this.createPhysicalServerForm.value.cCServerUser == 'Yes' ? true : false),
        purpose: this.createPhysicalServerForm.value.cPurpose,
        name: this.createPhysicalServerForm.value.cName,
        pn: this.createPhysicalServerForm.value.cPns,
        sn: this.createPhysicalServerForm.value.cSn,
        model: this.createPhysicalServerForm.value.cModel,
        carePackSAID: this.createPhysicalServerForm.value.cCarePackSaid,
        validContractThru: this.createPhysicalServerForm.value.cValidUntil,
        ipAddress: this.createPhysicalServerForm.value.cIpAddress,
        iloip: this.createPhysicalServerForm.value.cIloIp,
        cpu: this.createPhysicalServerForm.value.cCpu,
        hdd: this.createPhysicalServerForm.value.cHdd,
        ram: this.createPhysicalServerForm.value.cRam,
      }

      console.log(this.saveReqObj);
      this.physicalServer.savePhysicalServer(this.saveReqObj).subscribe((res: any) => {
        setTimeout(() =>{
          this.loadData();
        this.openSnackBar('Physical Server has been Updated Successfully');
        },1500)
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
      });
      this.createPhysicalServerForm.reset();
    }
  }

  deletePhysicalServer(physicalServerData: any) {
    this.deletePhysicalServers = physicalServerData;
  }

  deletePopupConfirmButton() {
    let deleteObj = this.deletePhysicalServers;
    this.physicalServer.deletePhysicalServer(deleteObj).subscribe(deleteUser => {
      this.loadData()
      this.openSnackBar('Physical Server has been Deleted Successfully');
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });

  }

  editPhysicalServer(editData: any) {
    this.EdithysicalServerID = editData.id;
    this.createPhysicalServerForm.patchValue({
      id: editData.id,
      locationID: editData.locationID,
      cCategory:editData.categoryID,
      cOsVersion:editData.operatingSystemId,
      cPatchingDay:editData.patchingDayID,
      cName:editData.name,
      cPurpose:editData.purpose,
      cPns:editData.pn,
      cSn:editData.sn,
      cModel:editData.model,
      cCarePackSaid:editData.carePackSAID,
      cValidUntil:editData.validContractThru.split("T")[0],
      cIpAddress:editData.ipAddress,
      cIloIp:editData.iloip,
      cCServerUser:editData.ccServerUser.toString() == 'true' ? 'Yes' : 'No',
      cHdd:editData.hdd,
      cRam:editData.ram,
      cCpu:editData.cpu
    });
  }

  updatePhysicalServers(){
    this.updateReqObj = {
      id:+this.EdithysicalServerID,
      locationID: +this.getLocId,
        categoryID: +this.createPhysicalServerForm.value.cCategory,
        operatingSystemId: +this.createPhysicalServerForm.value.cOsVersion,
        patchingDayID: +this.createPhysicalServerForm.value.cPatchingDay,
        ccServerUser: (this.createPhysicalServerForm.value.cCServerUser == 'Yes' ? true : false),
        purpose: this.createPhysicalServerForm.value.cPurpose,
        name: this.createPhysicalServerForm.value.cName,
        pn: this.createPhysicalServerForm.value.cPns,
        sn: this.createPhysicalServerForm.value.cSn,
        model: this.createPhysicalServerForm.value.cModel,
        carePackSAID: this.createPhysicalServerForm.value.cCarePackSaid,
        validContractThru: this.createPhysicalServerForm.value.cValidUntil,
        ipAddress: this.createPhysicalServerForm.value.cIpAddress,
        iloip: this.createPhysicalServerForm.value.cIloIp,
        cpu: this.createPhysicalServerForm.value.cCpu,
        hdd: this.createPhysicalServerForm.value.cHdd,
        ram: this.createPhysicalServerForm.value.cRam,
    }
    this.physicalServer.updatePhysicalServer(this.updateReqObj).subscribe(res => {
      this.loadData();
      this.openSnackBar('Physical Server has been Updated Successfully');
      this.createPhysicalServerForm.reset();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }
}

