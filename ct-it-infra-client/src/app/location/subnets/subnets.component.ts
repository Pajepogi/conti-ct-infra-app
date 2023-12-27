import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { PhysicalServerInterface } from 'src/app/interfaces/physical-server.interface';
import { SubnetsService } from 'src/app/services/subnets.service';
import { DaysOfWeek } from 'src/app/shared/enums/dayOfWeek.model';
import { ConstantMessage } from '../../shared/ConstantMessage/message';
import { AuthorizationService } from 'src/app/services/authorization.service';

import MockData from '../../../assets/json/physical-server.json';

@Component({
  selector: 'app-subnets',
  templateUrl: './subnets.component.html',
  styleUrls: ['./subnets.component.css']
})
export class SubnetsComponent implements OnInit {
  @Input() isLocActive: boolean;
  searchSubnetForm: FormGroup;
  createSubnetForm: FormGroup;
  saveReqObj: any;
  updateReqObj:any;
  searchReqObj: any;
  rearchResultTable: boolean = false;
  getLocId: any;
  deletesubnets: any;
  editSubnetID:any;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  constantMessage = ConstantMessage;
  userRole: any;
  deleteNoteVisibility:boolean = false;

  constructor(private subnetService: SubnetsService,
    private authService: AuthorizationService,
    private fb: FormBuilder, private _snackBar: MatSnackBar) {
      this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if (this.userRole.toUpperCase() != "ADMIN") {
        this.deleteNoteVisibility = true;
      }
     }

  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['action','id', 'locationCode', 'subnet', 'subnetname'];

  displayedColumns1 = ['action', 'sid', 'sidlocationcode', 'ssubnet', 'ssubnetname'];

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

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.searchSubnetForm = this.fb.group({

      ssubnet: [''],
      sid: [''],
      sidlocationcode: [''],
      ssubnetname: ['']

    });

    this.createSubnetForm = this.fb.group({
      cssubnet: ['', Validators.required],
      cssubnetname: ['', Validators.required],
      ssubnetname: ['', '']
    });

    this.getLocId = localStorage.getItem('locId')
  }

  // material snackbar code
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }


  get sid(): any { return this.createSubnetForm.get('sid'); }
  get sidlocationcode(): any { return this.createSubnetForm.get('sidlocationcode'); }
  get ssubnet(): any { return this.searchSubnetForm.get('ssubnet'); }
  get ssubnetname(): any { return this.createSubnetForm.get('ssubnetname'); }

  get cssubnet(): any { return this.createSubnetForm.get('cssubnet'); }
  get cssubnetname(): any { return this.createSubnetForm.get('cssubnetname'); }


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
    this.subnetService.getSubnets(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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
        this.subnetService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  editSubnetsServ(row: any) {
    this.editSubnet(row)
  }

  searchSubnets() {
    this.rearchResultTable = true;

    if (this.searchSubnetForm.status == 'INVALID' ) {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.searchReqObj = {
        subnet: this.searchSubnetForm.value.ssubnet,
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.subnetService.getSearchVirtualServer(pageAdd, this.pageSize, this.locationId, this.searchReqObj).subscribe((res: any) => {
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
    this.searchSubnetForm.reset();
    this.createSubnetForm.reset();
  }

  saveSubnets() {
    if (this.createSubnetForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.saveReqObj = {
        id_Location: +this.getLocId,
        subnet: this.createSubnetForm.value.cssubnet,
        subnetName: this.createSubnetForm.value.cssubnetname,
      }
      console.log('save')
      console.log(this.saveReqObj)
      this.subnetService.addSubnet(this.saveReqObj).subscribe(res => {
        setTimeout(() => {
          this.loadData();
        }, 2000)
        this.openSnackBar('Subnet has been Saved Successfully');
        this.createSubnetForm.reset();
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
      })
    }
  }

  editSubnet(editData: any) {
    this.editSubnetID = editData.id;
    this.createSubnetForm.patchValue({
      cssubnet: editData.subnet,
      cssubnetname:editData.subnetName,

    });
  }

  updateSubnet(){
    this.updateReqObj = {
      id:+this.editSubnetID,
      id_Location: +this.getLocId,
      subnet: this.createSubnetForm.value.cssubnet,
      subnetName: this.createSubnetForm.value.cssubnetname,

    }
    this.subnetService.updateSubnet(this.updateReqObj).subscribe(res => {
      setTimeout(() => {
        this.loadData();
      }, 2000)
      this.openSnackBar('Subnet has been Updated Successfully');
      this.createSubnetForm.reset();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  deleteSubnet(subnetData: any) {
    this.deletesubnets = {
      id:+subnetData.id,
      loC_ID: +subnetData.id_Location,
      subnet: subnetData.subnet,
      subnetName: +subnetData.subnetName,

    };
  }

  deletePopupConfirmButton() {
    let deleteObj = this.deletesubnets;
    this.subnetService.deleteSubnet(deleteObj).subscribe(deleteUser => {
      this.openSnackBar('Subnet has been Deleted Successfully');
      this.loadData()
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

}
