import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudStorageContainerInterface } from 'src/app/interfaces/cloud-storage-container.interface';
import { CloudStorageContainerService } from 'src/app/services/cloud-storage-container.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { AuthorizationServiceInterface } from 'src/app/interfaces/authorization-service-interface';

@Component({
  selector: 'app-cloud-storage-containers',
  templateUrl: './cloud-storage-containers.component.html',
  styleUrls: ['./cloud-storage-containers.component.css']
})
export class CloudStorageContainersComponent implements OnInit, AfterViewInit {
  @Input() isLocActive: boolean;
  addNewCloudContainerForm: FormGroup;
  searchCloudStorageContForm:FormGroup;
  saveObj: any;
  containerId: number = 0;
  api: string = "CloudContainer";
  userRole:string="";
  isDisable:boolean=false;
  searchReqObj:any;
  displayedColumns = ['action', 'backupJob', 'container','purpose'];
  displayedColumns1 = ['action', 'backupJob', 'container','purpose'];
  ELEMENT_DATA: CloudStorageContainerInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  show: boolean = true;
  rearchResultTable: boolean = false;
  @Input() locationId: any;
  @Input() locName: any;
  isExpanded: boolean= false;
  searchTerm: any;
  @ViewChild('input') searchText: ElementRef;
  dataSource: MatTableDataSource<CloudStorageContainerInterface> = new MatTableDataSource();
  dataSource1: MatTableDataSource<CloudStorageContainerInterface> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  private authService:AuthorizationServiceInterface;

  constructor(private fb: FormBuilder,
    private cloudStorageContService: CloudStorageContainerService,
    private commonService: CommonService,
    authService: AuthorizationService,
    private route: ActivatedRoute, private router: Router,
    private _snackBar: MatSnackBar
    ) {
        this.authService = authService;
        this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
      if(this.userRole.toUpperCase() != "ADMIN"){
        this.isDisable = true;
      }
    }

    ngOnInit() {
      this.addNewCloudContainerForm = this.fb.group({
        locationName:['', Validators.required],
        purpose: ['', Validators.required],
        backupJob: ['', Validators.required],
        container: ['', Validators.required]
      })

      this.searchCloudStorageContForm = this.fb.group({
        cloudContainer: [''],
        cloudPurpose: ['']
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
      // event.keyCode===13 is for detecting enter on the search text field
      if (event.keyCode === 13) {            
        event.preventDefault();
      }
    }

    if (this.searchTerm !== '') {
      if (event.keyCode === 13) {
        this.cloudStorageContService.searchCall(this.searchTerm, pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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
    this.cloudStorageContService.getCloudContainers(pageAdd, this.pageSize, this.locationId).subscribe((res: any) => {
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

    get locationName(): any { return this.addNewCloudContainerForm.get('locationName'); }
    get purpose(): any { return this.addNewCloudContainerForm.get('purpose'); }
    get container(): any { return this.addNewCloudContainerForm.get('container');}
    get backupJob(): any { return this.addNewCloudContainerForm.get('backupJob'); }

     createCloudContainer(){
        this.containerId = 0;
        this.addNewCloudContainerForm.get('locationName')?.setValue(this.locName);
        this.addNewCloudContainerForm.get('purpose')?.setValue('');
        this.addNewCloudContainerForm.get('container')?.setValue('');
        this.addNewCloudContainerForm.get('backupJob')?.setValue('');

    }

    saveCloudContainer(){
      this.saveObj = {
        id: this.containerId,
        loC_ID: this.locationId,
        name: this.addNewCloudContainerForm.value.name,
        purpose: this.addNewCloudContainerForm.value.purpose,
        container: this.addNewCloudContainerForm.value.container,
        backupJob: this.addNewCloudContainerForm.value.backupJob,
      }
      if(this.containerId == 0){
        this.addNewCloudContainer(this.saveObj);
      } else {
        this.updateCloudContainer(this.saveObj);
      }
    }

          addNewCloudContainer(reqObj: any) {
            this.commonService.addRecord(reqObj,this.api).subscribe(res => {
              this.openSnackBar('Cloud Storage Container has been Saved Successfully');
              this.loadData();
            }, error => {
              this.openSnackBar('Something went wrong. Please try after some time');
            })
            this.addNewCloudContainerForm.reset();
          }

        updateCloudContainer(reqObj: any) {
          this.commonService.updateRecord(reqObj,this.api).subscribe(res => {
              this.openSnackBar('Cloud Storage Container has been Updated Successfully');
              this.loadData();
            }, error => {
              this.openSnackBar('Something went wrong. Please try after some time');
          })
          this.addNewCloudContainerForm.reset()
        }

           editLocation(row: CloudStorageContainerInterface) {
            this.containerId = row.id;
            this.addNewCloudContainerForm.get('locationName')?.setValue(this.locName);
            this.addNewCloudContainerForm.get('purpose')?.setValue(row.purpose);
            this.addNewCloudContainerForm.get('container')?.setValue(row.container);
            this.addNewCloudContainerForm.get('backupJob')?.setValue(row.backupJob);

          }
         getRowLocData: any;
      deleteLocation(rowData: any) {
        this.getRowLocData = rowData;

      }
      popupConfirmButton() {

        let deleteObj = {
          Id: parseInt(this.getRowLocData.id),
          loc_id: this.getRowLocData.id_Location,
          name: this.getRowLocData.name,
          purpose: this.getRowLocData.purpose,
          container: this.getRowLocData.container,
          backupJob: this.getRowLocData.backupJob
        }

        this.commonService.deleteRecord(deleteObj,this.api).subscribe(deleteLoc => {
          this.openSnackBar('Cloud Storage Container has been Deleted Successfully');
          this.loadData();
        }, error => {
          this.openSnackBar('Something went wrong. Please try after some time');
        });
      }

      clearFormOnCancel() {
        this.searchCloudStorageContForm.reset();
        this.rearchResultTable = false;
       }

       searchCloudStorageCont() {
        this.loadData();
        this.rearchResultTable = true;
      
        if (this.searchCloudStorageContForm.status == 'INVALID') {
          this.openSnackBar('You entered invalid value in form');
        } else {
          this.searchReqObj = {
            container: this.searchCloudStorageContForm.value.cloudContainer,
            purpose: this.searchCloudStorageContForm.value.cloudPurpose
          }
          this.isLoading = true;
          let pageAdd = this.currentPage + 1;
          this.cloudStorageContService.getSearchCloudStorageCont(pageAdd, this.pageSize, this.locationId, this.searchReqObj.container, this.searchReqObj.purpose).subscribe((res: any) => {
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
