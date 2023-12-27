import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryInterface } from 'src/app/interfaces/category-interface';
import { LocationListInterface } from 'src/app/interfaces/location-list.interface';
import { CommonSettingsService } from 'src/app/services/common-settings.service';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  rearchResultTable: boolean = false;
  deleteCategoryData: any;
  editCategoryData: any;
  updateReqObj: any;
  createCategoryForm: FormGroup;
  editCateId: any;
  reqObj: any;
  saveObj: any;
  pageUrl: string = 'Category';
  @ViewChild('staticBackdrop3') staticBackdrop3: any;
  @ViewChild('staticBackdrop1') staticBackdrop1: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private locationService: LocationService,
    private commonSettingsService: CommonSettingsService
  ) { }

  displayedColumns = ['name', 'details', 'action'];
  displayedColumns1 = ['action', 'name', 'details'];
  ELEMENT_DATA: LocationListInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  show: boolean = true;
  formSubmitAlert: boolean = false
  message: string;
  dataSource: MatTableDataSource<CategoryInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<CategoryInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  settings: any;
  searchCategoryForm: FormGroup;
  searchTerm: any;
  searchReqObj: any;
  catName: string = 'name';
  catDetails: string = 'details'
  @ViewChild('input') searchText: ElementRef;

  ngOnInit() {
    this.loadData();
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.createCategoryForm = this.fb.group({
      name: ['', Validators.required],
      details: ['', Validators.required],

    });

    this.searchCategoryForm = this.fb.group({
      Searchname: [''],
      searchdetails: ['']
    });

  }
  get name(): any { return this.createCategoryForm.get('name'); }
  get details(): any { return this.createCategoryForm.get('details'); }
  get Searchname(): any { return this.searchCategoryForm.get('Searchname'); }
  get searchdetails(): any { return this.searchCategoryForm.get('searchdetails'); }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

    this.commonSettingsService.getList(this.pageUrl, pageAdd, this.pageSize).subscribe((res: any) => {
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

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  searchResultTabClosed() {
    this.rearchResultTable = false;
    this.createCategoryForm.reset();
  }

  arrowAnimate: boolean = false

  animateArrow() {
    if (this.arrowAnimate == true) {
      this.arrowAnimate = false
    } else if (this.arrowAnimate == false) {
      this.arrowAnimate = true
    }
  }


  deleteCategory(userData: any) {
    this.deleteCategoryData = userData;
  }

  editCategory(userData: any) {
    this.editCateId = userData.id;
    this.createCategoryForm.patchValue({
      name: userData.name,
      details: userData.details
    })
  }


  updateUser() {
    let updateReqObj = {
      id: +this.editCateId,
      name: this.createCategoryForm.value.name,
      details: this.createCategoryForm.value.details
    };
    this.commonSettingsService.update(this.pageUrl, updateReqObj).subscribe(saveCategory => {
      this.loadData()
      setTimeout(() => {
        this.openSnackBar('Category has been Updated Successfully');
        this.createCategoryForm.reset();
      }, 1000)
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });

  }

  saveCategory() {
    if (this.createCategoryForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
      this.createCategoryForm.reset();
    } else {
      let saveObj = {
        name: this.createCategoryForm.value.name,
        details: this.createCategoryForm.value.details
      }
      this.commonSettingsService.create(this.pageUrl, saveObj).subscribe(res => {
        this.loadData()
        setTimeout(() => {
          this.openSnackBar('Category has been Saved Successfully');
          this.createCategoryForm.reset();
        }, 1000)
      }, error => {
        this.openSnackBar('Something went wrong. Please try after some time');
      })
    }
  }

  deletePopupConfirmButton() {

    let deleteObj = this.deleteCategoryData;
    this.commonSettingsService.delete(this.pageUrl, deleteObj).subscribe(deleteCategory => {
      this.loadData();
      setTimeout(() => {
        this.openSnackBar('Category has been Deleted Successfully');
        this.createCategoryForm.reset();
      }, 1000)
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
        this.commonSettingsService.searchCall(this.pageUrl, pageAdd, this.pageSize, this.searchTerm, this.catName, this.catDetails).subscribe((res: any) => {
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
    this.searchCategoryForm.reset();
    this.createCategoryForm.reset();
    this.rearchResultTable = false;
  }

  searchPatchingDay() {
    this.rearchResultTable = true;
    if (this.searchCategoryForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid value in form');
    } else {
      this.searchReqObj = {
        name: this.searchCategoryForm.value.Searchname,
        details: this.searchCategoryForm.value.searchdetails
      }
      this.isLoading = true;
      let pageAdd = this.currentPage + 1;
      this.commonSettingsService.getSearch(this.pageUrl, pageAdd, this.pageSize, this.searchReqObj.name, this.searchReqObj.details,this.catName, this.catDetails).subscribe((res: any) => {
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
