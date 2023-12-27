import { AfterViewInit, Component, DirectiveDecorator, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { TapeUnitInterface } from 'src/app/interfaces/tape-unit.Interface';
import { TapeUnitService } from 'src/app/services/tape-unit.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysOfWeek } from '../../shared/enums/dayOfWeek.model';
import { formatDate } from '@angular/common';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-tape-unit',
  templateUrl: './tape-unit.component.html',
  styleUrls: ['./tape-unit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TapeUnitComponent implements OnInit, AfterViewInit  {
  @Input() isLocActive: boolean;
  addNewTapeUnitForm: FormGroup;
  connectionTypeDropdown: any;
  saveObj: any;
  tapeUnitId: number = 0;
  api: string = "tapunit";
  matSort: MatSort | null;
  searchTapeUnitForm: any;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;
  driverToAdd: any;

  constructor(private fb: FormBuilder,
    private tapeUnitService: TapeUnitService,
    private commonService: CommonService,
    private authService: AuthorizationService,
    private route: ActivatedRoute, private router: Router,
    private _snackBar: MatSnackBar
    ) {

      this.addNewTapeUnitForm = this.fb.group({
        locationName:[''],
        name: ['',Validators.required],
        firmware_Version: ['',Validators.required],
        model: [''],
        pn: ['',Validators.required],
        sn: ['',Validators.required],
        carePackSAID: [''],
        validContractThru: ['',Validators.required],
        ipAddress: ['',Validators.required],
        iloip: ['',Validators.required],
        drivers: ['',Validators.required],
        connectionType: ['',Validators.required],
      });

      this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if (this.userRole.toUpperCase() != "ADMIN") {
        this.deleteNoteVisibility = true;
      }
    }

  displayedColumns = ['action', 'name', 'connectionType', 'firmware_Version', 'model', 'pn',
    'sn', 'carePackSAID', 'validContractThru', 'ipAddress', 'iloip', 'drivers'];
    displayedColumns1 = ['action', 'cname', 'cconnectiontype', 'cfirmwareversion', 'cmodel',
    'cpn', 'csn', 'ccarepacksaid', 'cvaliduntil','cipAddress','ciloip','cdrivers'];

  ELEMENT_DATA: TapeUnitInterface[] = [];
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

  dataSource: MatTableDataSource<TapeUnitInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<TapeUnitInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.commonService.fetchConnectionType().subscribe(connectionTypeData => {
      this.connectionTypeDropdown = connectionTypeData;
    });

    this.searchTapeUnitForm = this.fb.group({
      name: [''],
      pn: [''],
      sn: [''],
      ipaddress: ['']
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
    this.tapeUnitService.getTapeUnit(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
      this.dataSource.data = res.data;
      this.totalRows = res.totalCount;
      console.log(res.data);
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

  createTapeUnit(){
    this.tapeUnitId = 0;
    this.addNewTapeUnitForm.get('name')?.setValue('');
    this.addNewTapeUnitForm.get('firmware_Version')?.setValue('');
    this.addNewTapeUnitForm.get('model')?.setValue('');
    this.addNewTapeUnitForm.get('pn')?.setValue('');
    this.addNewTapeUnitForm.get('sn')?.setValue('');
    this.addNewTapeUnitForm.get('carePackSAID')?.setValue('');
    this.addNewTapeUnitForm.get('validContractThru')?.setValue('');
    this.addNewTapeUnitForm.get('ipAddress')?.setValue('');
    this.addNewTapeUnitForm.get('iloip')?.setValue('');
    this.addNewTapeUnitForm.get('drivers')?.setValue('');
    document.querySelectorAll(".drivers").forEach(el => el.remove());
  }

    //Getting acces to form control for validation
    get name(): any { return this.addNewTapeUnitForm.get('name'); }
    get firmware_Version(): any { return this.addNewTapeUnitForm.get('firmware_Version'); }
    get connectionType(): any { return this.addNewTapeUnitForm.get('connectionType');}
    get model(): any { return this.addNewTapeUnitForm.get('model'); }
    get pn(): any { return this.addNewTapeUnitForm.get('pn'); }
    get sn(): any { return this.addNewTapeUnitForm.get('sn'); }
    get carePackSAID(): any { return this.addNewTapeUnitForm.get('carePackSAID'); }
    get validContractThru(): any { return this.addNewTapeUnitForm.get('validContractThru'); }
    get ipAddress(): any { return this.addNewTapeUnitForm.get('ipAddress'); }
    get iloip(): any { return this.addNewTapeUnitForm.get('iloip'); }
    get drivers(): any { return this.addNewTapeUnitForm.get('drivers'); }


  saveTapeUnit(){
    this.saveObj = {
      id: this.tapeUnitId,
      id_location: this.locationId,
      name: this.addNewTapeUnitForm.value.name,
      firmware_Version: this.addNewTapeUnitForm.value.firmware_Version,
      connectionTypeId: parseInt(this.addNewTapeUnitForm.value.connectionType.id),
      model: this.addNewTapeUnitForm.value.model,
      pn: this.addNewTapeUnitForm.value.pn,
      sn: this.addNewTapeUnitForm.value.sn,
      carePackSAID: this.addNewTapeUnitForm.value.carePackSAID,
      validContractThru: this.addNewTapeUnitForm.value.validContractThru,
      ipAddress: this.addNewTapeUnitForm.value.ipAddress,
      iloip: parseInt(this.addNewTapeUnitForm.value.iloip),
      drivers: this.addNewTapeUnitForm.value.drivers,
    }

      if(this.tapeUnitId == 0){
        this.addNewTapeUnit(this.saveObj);
      }else{
        this.updateTapeUnit(this.saveObj);
      }
  }


    addNewTapeUnit(reqObj: any) {
      this.commonService.addRecord(reqObj,this.api).subscribe(res => {
        this.openSnackBar('Tape Unit  has been Saved Successfully');
        // this.router.navigate(['/pages/editlocation/' + this.locationId]);
      this.loadData();
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
      })
      this.addNewTapeUnitForm.reset();
    }

       updateTapeUnit(reqObj: any) {
        this.commonService.updateRecord(reqObj,this.api).subscribe(res => {
          this.openSnackBar('Tape Unit has been Updated Successfully');
          // this.router.navigate(['/pages/editlocation/' + this.locationId]);
          this.loadData();
          }, error => {
            this.openSnackBar('Something went wrong. Please try after some time');
        })
        this.addNewTapeUnitForm.reset();
      }

        editLocation(row: TapeUnitInterface) {
          this.tapeUnitId = row.id;
          this.addNewTapeUnitForm.get('locationName')?.setValue(this.locName);
          this.addNewTapeUnitForm.get('name')?.setValue(row.name);
          this.addNewTapeUnitForm.get('firmware_Version')?.setValue(row.firmware_Version);
          this.addNewTapeUnitForm.get('model')?.setValue(row.model);
          this.addNewTapeUnitForm.get('pn')?.setValue(row.pn);
          this.addNewTapeUnitForm.get('sn')?.setValue(row.sn);
          this.addNewTapeUnitForm.get('carePackSAID')?.setValue(row.carePackSAID);
          this.addNewTapeUnitForm.get('validContractThru')?.setValue(formatDate(row.validContractThru,'yyyy-MM-dd','en'));
          this.addNewTapeUnitForm.get('ipAddress')?.setValue(row.ipAddress);
          this.addNewTapeUnitForm.get('iloip')?.setValue(row.iloip);
          this.addNewTapeUnitForm.get('drivers')?.setValue(row.drivers);
          let connTypeValue = this.connectionTypeDropdown.filter((e: any) => e.id == row.connectionTypeId);
          this.addNewTapeUnitForm.controls['connectionType'].setValue(connTypeValue[0]);

          this.driversLoad(row.drivers);
        }


      getRowLocData: any;
      deleteTapeUnit(rowData: any) {
        this.getRowLocData = rowData;
        console.log('rowData');
        console.log(rowData);
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
      iloip: this.getRowLocData.iloip,
      drivers: this.getRowLocData.drivers
    }
    this.commonService.deleteRecord(deleteObj,this.api).subscribe(deleteLoc => {
      this.openSnackBar('Tape Unit has been Deleted Successfully');
      // this.router.navigate(['/pages/editlocation/' + this.locationId]);
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  clearFormOnCancel() {
    this.rearchResultTable = false;
    this.addNewTapeUnitForm.reset();
    this.searchTapeUnitForm.reset();
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
        this.tapeUnitService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  searchTapeUnit() {
    this.rearchResultTable = true;

    if (this.searchTapeUnitForm.status == 'INVALID') {
    } else {
      this.searchReqObj = {
        name: this.searchTapeUnitForm.value.name,
        pn: this.searchTapeUnitForm.value.pn,
        sn: this.searchTapeUnitForm.value.sn,
        ipAddress: this.searchTapeUnitForm.value.ipaddress,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.tapeUnitService.getSearchTapeUnit(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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

  driversOnkeyup(data: any){
    let d = data.target.value;
    this.driversLoad(d);
  }

  driversLoad(d: any){
    this.driverToAdd = "";
    if(d.includes(",", 0)){
      let splitArr = d.split(",");
      if(splitArr.length > 0){
        for (let i = 0; i < splitArr.length; i++) {
          this.driverToAdd += '<div class="drivers">'+splitArr[i].trim()+'</div>';
        }
      }else{
        this.driverToAdd = '<div class="drivers">'+d+'</div>';
      }
    }else{
      if(d != null && d != ""){
        this.driverToAdd = '<div class="drivers">'+d+'</div>';
      }
    }
  }

}
