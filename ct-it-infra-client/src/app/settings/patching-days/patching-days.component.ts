import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { PatchingDayInterface } from 'src/app/interfaces/patching-day-interface';
import { CommonSettingsService } from 'src/app/services/common-settings.service';
import { TimeZones } from 'src/app/shared/enums/timezones';
import { DaysOfWeek } from 'src/app/shared/enums/dayOfWeek.model';
import { Time } from 'src/app/shared/array/Time';

@Component({
  selector: 'app-patching-days',
  templateUrl: './patching-days.component.html',
  styleUrls: [
    './../setting.component.css',
    '../../shared/css/modal-dialog.css',
    './patching-days.component.css'
  ]
})
export class PatchingDaysComponent implements OnInit {

  constructor(private settingsService: CommonSettingsService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['dayOfWeek', 'timeOfDay', 'timeZone', 'action'];
  displayedColumns1 = ['action', 'patchday', 'patchtime', 'Timezone'];
  ELEMENT_DATA: PatchingDayInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  isExpanded: boolean = false;
  dataSource: MatTableDataSource<PatchingDayInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<PatchingDayInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  patchingdayForm: FormGroup;
  reqObj: any;
  message: string;
  patchingDayId: number = 0;
  pageUrl: string = 'PatchingDay';
  dayPatch: string = 'patchday';
  zoneTime: string = 'timezone'
  searchPatchingDayForm: FormGroup;
  searchTerm: any;
  rearchResultTable: boolean = false;
  searchReqObj: any;
  @ViewChild('input') searchText: ElementRef;
  timeZones: any;
  weeks = DaysOfWeek;
  enumWeeks: any;
  arrTime = Time;

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
    this.patchingdayForm = this.formBuilder.group({
      patchingDayId: [''],
      dayOfWeek: ['', Validators.required],
      timeOfDay: ['', Validators.required],
      timeZone: ['']
    });

    this.timeZones = Object.values(TimeZones);
    this.timeZones.sort();

    this.enumWeeks = Object.keys(this.weeks).filter(f => !isNaN(Number(f)));


    this.searchPatchingDayForm = this.fb.group({
      patchday: [''],
      timezone: ['']
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

  toggle() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
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

  get dayOfWeek(): any { return this.patchingdayForm.get('dayOfWeek'); }
  get timeOfDay(): any { return this.patchingdayForm.get('timeOfDay'); }
  get timeZone(): any { return this.patchingdayForm.get('timeZone'); }

  onFormSubmit(element: any) {
      if (this.patchingdayForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.reqObj = {
        id: this.patchingDayId,
        dayOfWeek: +this.patchingdayForm.value.dayOfWeek,
        timeOfDay: this.patchingdayForm.value.timeOfDay,
        timeZone: this.patchingdayForm.value.timeZone,
      }
      if (this.patchingDayId > 0) {
        this.saveEdit();
      } else {
        this.saveAdd();
      }
      this.resetForm(this.patchingdayForm);
    }
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  CreatePatch(){
    this.patchingDayId = 0;
    this.patchingdayForm.get('dayOfWeek')?.setValue('');
    this.patchingdayForm.get('timeOfDay')?.setValue('');
    this.patchingdayForm.get('timeZone')?.setValue('');
  }

  edit(element: any) {
    this.patchingDayId = element.id;
    this.patchingdayForm = this.formBuilder.group({
      patchingDayId: element.id,
      dayOfWeek: [element.dayOfWeek, Validators.required],
      timeOfDay: [element.timeOfDay, Validators.required],
      timeZone: element.timeZone
    });
  }

  saveAdd() {
    this.settingsService.create(this.pageUrl, JSON.stringify(this.reqObj)).subscribe(res => {
      this.openSnackBar('Patching Day has been Saved Successfully');
      setTimeout(() => {
        this.loadData();
      }, 2000)
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  saveEdit() {
    this.settingsService.update(this.pageUrl, this.reqObj).subscribe(res => {
      this.openSnackBar('Patching Day has been Updated Successfully');
      setTimeout(() => {
        this.loadData();
      }, 2000)
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  getRowData: any;
  deleteItem(rowData: any) {
    this.getRowData = rowData;
  }

  popupConfirmButton() {
    let deleteObj = this.getRowData
    this.settingsService.delete(this.pageUrl, deleteObj).subscribe(data => {
      this.openSnackBar('Patching Day has been Deleted Successfully');
      setTimeout(() => {
        this.loadData();
      }, 2000)
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
    console.log(this.searchTerm.length)
    if (this.searchTerm === '' || this.searchTerm.length == 1) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
      this.loadData()
    }

    if (this.searchTerm !== '') {
      if (event.keyCode === 13) {
        this.settingsService.searchCall(this.pageUrl, pageAdd, this.pageSize, this.searchTerm, this.dayPatch, this.zoneTime).subscribe((res: any) => {
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
    this.searchPatchingDayForm.reset();
    this.patchingdayForm.reset();
    this.rearchResultTable = false;
  }

  searchPatchingDay() {
    this.rearchResultTable = true;
    if (this.searchPatchingDayForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.searchReqObj = {
        patchday: this.searchPatchingDayForm.value.patchday,
        timezone: this.searchPatchingDayForm.value.timezone
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.settingsService.getSearch(this.pageUrl, pageAdd, this.pageSize, this.searchReqObj.patchday, this.searchReqObj.timezone,this.dayPatch, this.zoneTime).subscribe((res: any) => {
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
