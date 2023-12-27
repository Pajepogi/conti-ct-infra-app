import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { HttpClient } from '@angular/common/http';
import { TechnicalContactInterface } from 'src/app/interfaces/technical-contact-interface'; 
import { TechnicalContactService } from 'src/app/services/technical-contacts.service'; 
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-technical-contacts',
  templateUrl: './technical-contacts.component.html',
  styleUrls: ['./technical-contacts.component.css']
})
export class TechnicalContactsComponent implements OnInit {
  @ViewChild(MatSort) matSort!: MatSort;
  displayedColumns = ['action', 'id', 'ldaP_UID', 'techContactResponsibility', 'email'];
  ELEMENT_DATA: TechnicalContactInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  @Input() locationId: any;
  @Input() isLocActive: boolean;
  isExpanded: boolean= false;
  editRowData: any;

  dataSource: MatTableDataSource<TechnicalContactInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  formSubmitAlert: boolean = false;
  technicalContactForm: FormGroup;
  technicalContactId: 0;
  techContactResponsibilities: any;
  reqObj: any;
  deleteObj:any;
  getRowData: any;
  deleteTechnicalContact:any;
  message: string;

  constructor(private fb: FormBuilder, private technicaContactService: TechnicalContactService, private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.getTechRespDropDown();

    this.technicalContactForm = this.fb.group({
      id: ['', Validators.required],
      ldaP_UID: ['', Validators.required],
      techContactResponsibility: ['', Validators.required],
      email: ['', Validators.required],
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

  getTechRespDropDown(){
    const dropdownUrl = environment.gatewayURL + 'TechContactResponsibility';
    this.http.get(dropdownUrl).subscribe((res) => {
      this.techContactResponsibilities = res;
    })
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
    this.technicaContactService.getTechnicalContacts(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

  get id(): any { return this.technicalContactForm.get('technicalContactId'); }
  get ldaP_UID(): any { return this.technicalContactForm.get('ldaP_UID'); }
  get techContactResponsibility(): any { return this.technicalContactForm.get('techContactResponsibility'); }
  get email(): any { return this.technicalContactForm.get('email'); }

  onFormSubmit() {
    if (this.technicalContactForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.reqObj = {
        id: this.technicalContactForm.value.id,
        locationsId: this.locationId,
        ldaP_UID: this.technicalContactForm.value.ldaP_UID,
        techContactResponsibilityID: this.technicalContactForm.value.techContactResponsibility,
        email: this.technicalContactForm.value.email
      }
      if(this.technicalContactId > 0){
        this.saveEdit();
      }else{
        this.saveAdd();
      }
    }
	}
  
	resetForm(form: FormGroup) {
		form.reset();
    this.technicalContactId = 0;
    this.technicalContactForm.controls["id"].setValue(0);
	}

  resetAddForm(){
    this.resetForm(this.technicalContactForm);
  }

  edit(element: any){
    if(element.id != null && element.id > 0){
      this.technicalContactId = element.id;
    } 

    this.technicalContactForm = this.fb.group({
        id: this.technicalContactId,
        ldaP_UID: element.ldaP_UID,
        techContactResponsibility: element.techContactResponsibility.id,
        email: element.email
    });
  }

  saveAdd(){
    this.technicaContactService.create(this.reqObj).subscribe(res => {
      this.openSnackBar('Technical Contact has been Saved Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    })  
  }

  saveEdit(){
    console.log(this.reqObj);
    this.technicaContactService.update(this.reqObj).subscribe(res => {
      this.openSnackBar('Technical Contact has been Updated Successfully');
      this.loadData();
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

 
   deleteItem(rowData: any) {
     this.deleteTechnicalContact = {
        id: rowData.id,
        locationsId: this.locationId,
        ldaP_UID: rowData.ldaP_UID,
        techContactResponsibilityID: rowData.techContactResponsibility.id,
        email: rowData.email
     }
   }
   
   popupConfirmButton() {
     this.deleteObj =  this.deleteTechnicalContact;
     console.log(this.deleteObj)
      this.technicaContactService.delete(this.deleteObj).subscribe(data => {
        this.openSnackBar('Technical Contact has been Deleted Successfully');
      this.loadData();
     }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
     });
   }

}
