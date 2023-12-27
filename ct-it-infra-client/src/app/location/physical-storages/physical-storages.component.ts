import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { PhysicalServerInterface } from 'src/app/interfaces/physical-server.interface';
import { PhysicalStoragesService } from 'src/app/services/physical-storages.service';
import { DaysOfWeek } from 'src/app/shared/enums/dayOfWeek.model';
import { CommonService } from 'src/app/services/common.service';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';


@Component({
  selector: 'app-physical-storages',
  templateUrl: './physical-storages.component.html',
  styleUrls: ['./physical-storages.component.css']
})
export class PhysicalStoragesComponent implements OnInit {
  @Input() isLocActive: boolean;
  searchPhysicalStoragesForm: FormGroup;
  createPhysicalStoragesForm: FormGroup;
  saveReqObj: any;
  searchReqObj: any;
  updateReqObj:any;
  rearchResultTable: boolean = false;
  EdithysicalStorageID:any;
  getLocId: any;
  deletePhysicalStorages: any;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  connectionTypeDropdown: any;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;

  constructor(private physicalStorage: PhysicalStoragesService,
    private commonService: CommonService,
    private authService: AuthorizationService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar) {
      this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if (this.userRole.toUpperCase() != "ADMIN") {
        this.deleteNoteVisibility = true;
      }
     }

  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['action', 'id', 'operatingSystem', 'name', 'connectiontype', 'purpose', 'pn',
    'sn', 'model', 'carePack', 'validUntil', 'ipAddr', 'iLoip', 'amounttb'];

  displayedColumns1 = ['action', 'cid', 'cconnectiontype','cpurpose', 'operatingSystem', 'cname', 'cpn',
    'csn', 'cmodel', 'ccarepacksaid', 'cvaliduntil', 'cipaddress', 'ciloip', 'camounttb'];

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
  patchingDays: any = localStorage.getItem('patchingDays');

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.searchPhysicalStoragesForm = this.fb.group({
      name: [''],
      pn: [''],
      sn: [''],
      ipaddress: ['']
    });

    this.createPhysicalStoragesForm = this.fb.group({
      operatingSystem: ['', Validators.required],
      cPurpose: ['', Validators.required],
      cName: ['', Validators.required],
      cIpAddress: ['', Validators.required],
      cPns: ['', Validators.required],
      cSn: ['', Validators.required],
      cModel: ['', Validators.required],
      cCarePackSaid: ['', Validators.required],
      cValidUntil: ['', Validators.required],
      cIloIp: ['', Validators.required],
      amounttb:['', Validators.required],
      cconnectiontype:['', Validators.required],
    });
    this.patchingDays = JSON.parse(this.patchingDays)
    this.getLocId = localStorage.getItem('locId')
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

  get pn(): any { return this.searchPhysicalStoragesForm.get('pn'); }
  get sn(): any { return this.searchPhysicalStoragesForm.get('sn'); }
  get ipaddress(): any { return this.searchPhysicalStoragesForm.get('ipaddress'); }
  get name(): any { return this.searchPhysicalStoragesForm.get('name'); }

  get cconnectiontype(): any { return this.createPhysicalStoragesForm.get('cconnectiontype'); }
  get amounttb(): any { return this.createPhysicalStoragesForm.get('amounttb'); }
  get operatingSystem(): any { return this.createPhysicalStoragesForm.get('operatingSystem'); }
  get cPatchingDay(): any { return this.createPhysicalStoragesForm.get('cPatchingDay'); }
  get cTechnicalcontact(): any { return this.createPhysicalStoragesForm.get('cTechnicalcontact'); }
  get cPurpose(): any { return this.createPhysicalStoragesForm.get('cPurpose'); }
  get cName(): any { return this.createPhysicalStoragesForm.get('cName'); }
  get cType(): any { return this.createPhysicalStoragesForm.get('cType'); }
  get cSn(): any { return this.createPhysicalStoragesForm.get('cSn'); }
  get cPns(): any { return this.createPhysicalStoragesForm.get('cPns'); }
  get cModel(): any { return this.createPhysicalStoragesForm.get('cModel'); }

  get cCarePackSaid(): any { return this.createPhysicalStoragesForm.get('cCarePackSaid'); }
  get cValidUntil(): any { return this.createPhysicalStoragesForm.get('cValidUntil'); }
  get cIpAddress(): any { return this.createPhysicalStoragesForm.get('cIpAddress'); }
  get cIloIp(): any { return this.createPhysicalStoragesForm.get('cIloIp'); }

  get cCpu(): any { return this.createPhysicalStoragesForm.get('cCpu'); }
  get cHdd(): any { return this.createPhysicalStoragesForm.get('cHdd'); }
  get cRam(): any { return this.createPhysicalStoragesForm.get('cRam'); }


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
    this.physicalStorage.getPhysicalStorages(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.dataSource1.data = res.data;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  editPhyServ(row: any) {
    this.editPhysicalStorage(row)
  }

  clearFormOnCancel() {
    this.rearchResultTable = false;
    this.searchPhysicalStoragesForm.reset();
    this.createPhysicalStoragesForm.reset();
  }

  savePhysicalStorages() {
    if (this.createPhysicalStoragesForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.saveReqObj = {
        loC_ID: +this.getLocId,
        operatingSystem: this.createPhysicalStoragesForm.value.operatingSystem,
        connectionTypeId: +this.createPhysicalStoragesForm.value.cconnectiontype.id,
        name: this.createPhysicalStoragesForm.value.cName,
        purpose: this.createPhysicalStoragesForm.value.cPurpose,
        pn: this.createPhysicalStoragesForm.value.cPns,
        sn: this.createPhysicalStoragesForm.value.cSn,
        model: this.createPhysicalStoragesForm.value.cModel,
        carePackSAID: this.createPhysicalStoragesForm.value.cCarePackSaid,
        validContractThru: this.createPhysicalStoragesForm.value.cValidUntil.split("T")[0],
        ipAddress: this.createPhysicalStoragesForm.value.cIpAddress,
        iloip: this.createPhysicalStoragesForm.value.cIloIp,
        amountTb:this.createPhysicalStoragesForm.value.amounttb
      }
      this.physicalStorage.savePhysicalStorage(this.saveReqObj).subscribe(res => {
        setTimeout(()=>{
          this.loadData();
        },3000)
        this.openSnackBar('Physical Storage has been Saved Successfully');
        this.createPhysicalStoragesForm.reset();
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
      })
    }
  }

  editPhysicalStorage(editData: any) {
    this.EdithysicalStorageID = editData.id;
    let connTypeValue = this.connectionTypeDropdown.filter((e: any) => e.id == editData.connectionTypeId);
    this.createPhysicalStoragesForm.patchValue({
      id: editData.id,
      loC_ID: editData.locationID,
      operatingSystem:editData.operatingSystem,
      cName:editData.name,
      cconnectiontype: connTypeValue[0],
      cPurpose:editData.purpose,
      cPns:editData.pn,
      cSn:editData.sn,
      cModel:editData.model,
      cCarePackSaid:editData.carePackSAID,
      cValidUntil:editData.validContractThru.split("T")[0],
      cIpAddress:editData.ipAddress,
      cIloIp:editData.iloip,
      amounttb:editData.amountTb
    });
  }

  updatePhysicalStorage(){
    this.updateReqObj = {
      id:+this.EdithysicalStorageID,
      loC_ID: +this.getLocId,
      operatingSystem: this.createPhysicalStoragesForm.value.operatingSystem,
      connectionTypeId: +this.createPhysicalStoragesForm.value.cconnectiontype.id,
      purpose: this.createPhysicalStoragesForm.value.cPurpose,
        name: this.createPhysicalStoragesForm.value.cName,
        pn: this.createPhysicalStoragesForm.value.cPns,
        sn: this.createPhysicalStoragesForm.value.cSn,
        model: this.createPhysicalStoragesForm.value.cModel,
        carePackSAID: this.createPhysicalStoragesForm.value.cCarePackSaid,
        validContractThru: this.createPhysicalStoragesForm.value.cValidUntil,
        ipAddress: this.createPhysicalStoragesForm.value.cIpAddress,
        iloip: this.createPhysicalStoragesForm.value.cIloIp,
        amountTb: this.createPhysicalStoragesForm.value.amounttb
    }
    this.physicalStorage.updatePhysicalStorage(this.updateReqObj).subscribe(res => {
      this.loadData();
      this.openSnackBar('Physical Storage has been Updated Successfully');
      this.createPhysicalStoragesForm.reset();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  deletePhysicalStorage(physicalStorageData: any) {
    this.deletePhysicalStorages = {
      id:+physicalStorageData.id,
      loC_ID: +physicalStorageData.loC_ID,
      operatingSystem: physicalStorageData.operatingSystem,
      connectionTypeId: +physicalStorageData.connectionTypeId,
      purpose: physicalStorageData.purpose,
        name: physicalStorageData.name,
        pn: physicalStorageData.pn,
        sn: physicalStorageData.sn,
        model: physicalStorageData.model,
        carePackSAID: physicalStorageData.carePackSAID,
        validContractThru: physicalStorageData.validContractThru,
        ipAddress: physicalStorageData.ipAddress,
        iloip: physicalStorageData.iloip,
        amountTb: physicalStorageData.amountTb
    };
  }

  deletePopupConfirmButton() {
    let deleteObj = this.deletePhysicalStorages;
    this.physicalStorage.deletePhysicalStorage(deleteObj).subscribe(deleteUser => {
      this.loadData()
      this.openSnackBar('Physical Storage has been Deleted Successfully');
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
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
        this.physicalStorage.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  searchPhysicalStorages() {
    this.rearchResultTable = true;

    if (this.searchPhysicalStoragesForm.status == 'INVALID') {
    } else {
      this.searchReqObj = {
        name: this.searchPhysicalStoragesForm.value.name,
        pn: this.searchPhysicalStoragesForm.value.pn,
        sn: this.searchPhysicalStoragesForm.value.sn,
        ipAddress: this.searchPhysicalStoragesForm.value.ipaddress,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.physicalStorage.getSearchPhysicalStorage(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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
