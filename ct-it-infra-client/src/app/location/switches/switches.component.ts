import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SwitchesInterface } from 'src/app/interfaces/Switches.Interface';
import { SwitchesService } from 'src/app/services/switches.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysOfWeek } from '../../shared/enums/dayOfWeek.model';
import { formatDate } from '@angular/common';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.css']
})
export class SwitchesComponent implements OnInit,AfterViewInit {
  @Input() isLocActive: boolean;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;

  constructor(private fb: FormBuilder,
    private switchesService: SwitchesService,
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


  addNewSwitchesForm: FormGroup;
  connectionTypeDropdown: any;
  saveObj: any;
  api: string = "Switches";

  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['action','name', 'purpose','connectionType', 'pn',
    'sn','carePack', 'validUntil', 'ipAddr', 'ipAddr2'];
    displayedColumns1 = ['action', 'cid', 'cname', 'cpurpose', 'cconnectiontype', 'cpn', 'csn',
    'carepacksaid', 'validuntil', 'cipAddress', 'cipAddress2'];

  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  @Input() locationId: any;
  @Input() locName: any;
  switchId: number = 0;
  weekDay = DaysOfWeek;
  isExpanded: boolean= false;
  searchReqObj: any;
  rearchResultTable: boolean = false;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  searchSwitchesForm: FormGroup;
  dataSource: MatTableDataSource<SwitchesInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  ngOnInit(): void  {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.addNewSwitchesForm = this.fb.group({
      locationName:[''],
      sname: ['', Validators.required],
      purpose: ['',Validators.required],
      model: [''],
      pn: ['',Validators.required],
      sn: ['',Validators.required],
      carePackSAID: [''],
      validContractThru:['',Validators.required],
      ipAddress1: ['',Validators.required],
      ipAddress2: ['',Validators.required],
      connectionType: ['', Validators.required]
    });

    this.searchSwitchesForm = this.fb.group({
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
    this.switchesService.getSwitches(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Clear objects for new switches
  createSwitch(){
    this.switchId = 0;
    this.addNewSwitchesForm.get('locationName')?.setValue(this.locName);
    this.addNewSwitchesForm.get('sname')?.setValue('');
    this.addNewSwitchesForm.get('purpose')?.setValue('');
    this.addNewSwitchesForm.get('model')?.setValue('');
    this.addNewSwitchesForm.get('pn')?.setValue('');
    this.addNewSwitchesForm.get('sn')?.setValue('');
    this.addNewSwitchesForm.get('carePackSAID')?.setValue('');
    this.addNewSwitchesForm.get('validContractThru')?.setValue('');
    this.addNewSwitchesForm.get('ipAddress1')?.setValue('');
    this.addNewSwitchesForm.get('ipAddress2')?.setValue('');
  }

    //Getting acces to form control for validation
    get locationName(): any { return this.addNewSwitchesForm.get('locationName'); }
    get sname(): any { return this.addNewSwitchesForm.get('sname'); }
    get purpose(): any { return this.addNewSwitchesForm.get('purpose'); }
    get connectionType(): any { return this.addNewSwitchesForm.get('connectionType');}
    get model(): any { return this.addNewSwitchesForm.get('model'); }
    get pn(): any { return this.addNewSwitchesForm.get('pn'); }
    get sn(): any { return this.addNewSwitchesForm.get('sn'); }
    get carePackSAID(): any { return this.addNewSwitchesForm.get('carePackSAID'); }
    get validContractThru(): any { return this.addNewSwitchesForm.get('validContractThru'); }
    get ipAddress1(): any { return this.addNewSwitchesForm.get('ipAddress1'); }
    get ipAddress2(): any { return this.addNewSwitchesForm.get('ipAddress2'); }

    get name(): any { return this.searchSwitchesForm.get('name'); }
    //Saving new switches
  saveSwitches(){
    this.saveObj = {
      id: this.switchId,
      id_location: this.locationId,
      name: this.addNewSwitchesForm.value.sname,
      purpose: this.addNewSwitchesForm.value.purpose,
      connectionTypeId: parseInt(this.addNewSwitchesForm.value.connectionType.id),
      model: this.addNewSwitchesForm.value.model,
      pn: this.addNewSwitchesForm.value.pn,
      sn: this.addNewSwitchesForm.value.sn,
      carePackSAID: this.addNewSwitchesForm.value.carePackSAID,
      ValidContractThru: this.addNewSwitchesForm.value.validContractThru,
      ipAddress: this.addNewSwitchesForm.value.ipAddress1,
      ipAddress2:  this.addNewSwitchesForm.value.ipAddress2,
    }

    if(this.switchId == 0){
      this.addNewSwitches(this.saveObj);
    } else {
      this.updateSwitches(this.saveObj);
    }
    console.log(this.saveObj);
  }

    //Method for adding switches
    addNewSwitches(reqObj: any) {
      this.commonService.addRecord(reqObj,this.api).subscribe(res => {
        this.openSnackBar('Switches has been Saved Successfully');
        // this.router.navigate(['/pages/editlocation/' + this.locationId]);
        this.loadData();
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
      })
      this.addNewSwitchesForm.reset();
    }

    //Method for update switches
    updateSwitches(reqObj: any) {
      console.log('update')
      console.log(reqObj)
      this.commonService.updateRecord(reqObj,this.api).subscribe(res => {
          this.openSnackBar('Switches has been Updated Successfully');
          // this.router.navigate(['/pages/editlocation/' + this.locationId]);
          this.loadData();
        }, error => {
          this.openSnackBar('Something went wrong. Please try after some time');
      })
      this.addNewSwitchesForm.reset();
    }
    //Edit modal setup/assign value
    editLocation(row: SwitchesInterface) {
      this.switchId = row.id;
      this.addNewSwitchesForm.get('locationName')?.setValue(this.locName);
      this.addNewSwitchesForm.get('sname')?.setValue(row.name);
      this.addNewSwitchesForm.get('purpose')?.setValue(row.purpose);
      this.addNewSwitchesForm.get('model')?.setValue(row.model);
      this.addNewSwitchesForm.get('pn')?.setValue(row.pn);
      this.addNewSwitchesForm.get('sn')?.setValue(row.sn);
      this.addNewSwitchesForm.get('carePackSAID')?.setValue(row.carePackSAID);
      this.addNewSwitchesForm.get('validContractThru')?.setValue(formatDate(row.validContractThru,'yyyy-MM-dd','en'));
      this.addNewSwitchesForm.get('ipAddress1')?.setValue(row.ipAddress);
      this.addNewSwitchesForm.get('ipAddress2')?.setValue(row.ipAddress2);
      let connTypeValue = this.connectionTypeDropdown.filter((e: any) => e.id == row.connectionTypeId);
      this.addNewSwitchesForm.controls['connectionType'].setValue(connTypeValue[0]);
    }

    //Delete switchess functionality popup
    getRowLocData: any;
    deleteLocation(rowData: any) {
      this.getRowLocData = rowData;
      console.log('rowData');
      console.log(rowData);
    }

  popupConfirmButton() {
    let deleteObj = {
      Id: parseInt(this.getRowLocData.id),
      id_Location: this.getRowLocData.id_Location,
      name: this.getRowLocData.name,
      purpose: this.getRowLocData.purpose,
      connectionTypeId: this.getRowLocData.connectionTypeId,
      pn: this.getRowLocData.pn,
      sn: this.getRowLocData.sn,
      model: this.getRowLocData.model,
      carePackSAID: this.getRowLocData.carePackSAID,
      validContractThru: this.getRowLocData.validContractThru,
      ipAddress: this.getRowLocData.ipAddress,
      ipAddress2: this.getRowLocData.ipAddress2
    }
    this.commonService.deleteRecord(deleteObj,this.api).subscribe(deleteLoc => {
      this.openSnackBar('Switches has been Deleted Successfully');
      // this.router.navigate(['/pages/editlocation/' + this.locationId]);
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  clearFormOnCancel() {
    this.rearchResultTable = false;
    this.addNewSwitchesForm.reset();
    this.searchSwitchesForm.reset();
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
        this.switchesService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  searchSwitches() {
    this.rearchResultTable = true;

    if (this.searchSwitchesForm.status == 'INVALID') {
    } else {
      this.searchReqObj = {
        name: this.searchSwitchesForm.value.name,
        pn: this.searchSwitchesForm.value.pn,
        sn: this.searchSwitchesForm.value.sn,
        ipAddress: this.searchSwitchesForm.value.ipaddress,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.switchesService.getSearchSwitches(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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


