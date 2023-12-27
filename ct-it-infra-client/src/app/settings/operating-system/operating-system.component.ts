import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { OperatingSystemInterface } from 'src/app/interfaces/operating-system-interface';
import { CommonSettingsService } from 'src/app/services/common-settings.service';
import { OperatingSystems } from 'src/app/shared/array/OperatingSystems';

@Component({
  selector: 'app-operating-system',
  templateUrl: './operating-system.component.html',
  styleUrls: [
    './../setting.component.css',
    '../../shared/css/modal-dialog.css',
    './operating-system.component.css'
  ]
})
export class OperatingSystemComponent implements OnInit {

  constructor(private settingsService: CommonSettingsService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
    ) { }

  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['osName','osVersion', 'action'];
  displayedColumns1 = ['action', 'osName', 'osVersion'];
  ELEMENT_DATA: OperatingSystemInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  isExpanded: boolean= false;

  dataSource: MatTableDataSource<OperatingSystemInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<OperatingSystemInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  opertatingSystemForm: FormGroup;
  reqObj: any;
  message: string;
  operatingSystemId: number = 0;
  searchOperatingSystemForm: FormGroup;
  searchTerm: any;
  rearchResultTable: boolean = false;
  searchReqObj: any;
  @ViewChild('input') searchText: ElementRef;
  pageUrl: string = 'OS';
  nameOS: string = 'osName';
  versionOS: string = 'osVersion'
  arrOS=OperatingSystems;


  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.opertatingSystemForm = this.formBuilder.group({
      operatingSystemId: [''],
      osName: ['', Validators.required],
      osVersion: ['', Validators.required]
    });

    this.searchOperatingSystemForm = this.formBuilder.group({
      osname: [''],
      osverion: ['']
    });
    this.loadData();
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2500
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
    this.settingsService.getList(this.pageUrl, pageAdd, this.pageSize).subscribe((res: any) => {
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

  get osName(): any { return this.opertatingSystemForm.get('osName'); }
  get osVersion(): any { return this.opertatingSystemForm.get('osVersion'); }

  onFormSubmit() {
    if (this.opertatingSystemForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.reqObj = {
        id: this.operatingSystemId,
        osName: this.opertatingSystemForm.value.osName,
        osVersion: this.opertatingSystemForm.value.osVersion,
      }
      if(this.operatingSystemId > 0){
        this.saveEdit();
      }else{
        this.saveAdd();
      }
      this.resetForm(this.opertatingSystemForm);
    }
	}

	resetForm(form: FormGroup) {
		form.reset();
	}

  CreateOS(){
    this.operatingSystemId = 0;
    this.opertatingSystemForm.get('osName')?.setValue('');
    this.opertatingSystemForm.get('osVersion')?.setValue('');
  }

  edit(element: any){
    this.operatingSystemId = element.id;
    this.opertatingSystemForm = this.formBuilder.group({
      operatingSystemId: element.id,
      osName: [element.osName, Validators.required],
      osVersion: [element.osVersion, Validators.required],
    });
  }

  saveAdd(){
    this.settingsService.create(this.pageUrl, this.reqObj).subscribe(res => {
      this.openSnackBar('Operating System has been Saved Successfully');
      setTimeout(() =>{
        this.loadData();
      },2000)
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  saveEdit(){
    this.settingsService.update(this.pageUrl, this.reqObj).subscribe(res => {
      this.openSnackBar('Operating System has been Updated Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

   getRowData: any;
   deleteItem(rowData: any) {
     this.getRowData = rowData;
   }

   popupConfirmButton() {
     let deleteObj =this.getRowData
     this.settingsService.delete(this.pageUrl, deleteObj).subscribe(data => {
      this.openSnackBar('Operating System has been Deleted Successfully');
      this.loadData();
     }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
     });
   }

   onInputChange(event: any) {
     this.searchTerm = event.target.value;
    if (event.target.value === '') {
      if (event.keyCode === 13) {
        event.preventDefault()
      }
    } else {
    }
  }

  keyDownFunction(event: any) {
    this.isLoading = true;
    let pageAdd = this.currentPage + 1;
    this.searchTerm = this.searchText.nativeElement.value;
    if (this.searchTerm === '' || this.searchTerm.length == 1) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
      this.loadData();
    }

    if (this.searchTerm !== '') {
      if (event.keyCode === 13) {
        this.settingsService.searchCall(this.pageUrl, pageAdd, this.pageSize, this.searchTerm, this.nameOS, this.versionOS).subscribe((res: any) => {
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

  clearFormOnCancel() {
    this.searchOperatingSystemForm.reset();
    this.opertatingSystemForm.reset();
    this.rearchResultTable = false;
  }

  searchOperatingystem() {
    this.rearchResultTable = true;
    if (this.searchOperatingSystemForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.searchReqObj = {
        osName: this.searchOperatingSystemForm.value.osname,
        osVersion: this.searchOperatingSystemForm.value.osversion
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.settingsService.getSearch(this.pageUrl, pageAdd, this.pageSize, this.searchReqObj.osName, this.searchReqObj.osVersion, this.nameOS, this.versionOS).subscribe((res: any) => {
        this.dataSource1.data = res.data;
        console.log(this.dataSource1.data)
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
