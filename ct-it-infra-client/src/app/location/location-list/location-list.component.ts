import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { LocationListInterface } from 'src/app/interfaces/location-list.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})


export class LocationListComponent implements OnInit, AfterViewInit {

  userRole: any;
  disableCreateButton:boolean = false;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private authService: AuthorizationService,
    private _snackBar: MatSnackBar
    ) {
    this.authService.UserRoles.subscribe(role => this.userRole = role.RoleName)
    if (this.userRole.toUpperCase() != "ADMIN") {
      this.disableCreateButton = true;
    } }

  displayedColumns = ['action', 'isActive', 'locationCode', 'locationName', 'ladpDomain', 'ladpContainer', 'region',
    'country', 'architecDiagram', 'cuNum', 'ccNum', 'timezone', 'bmcGrp'];
  ELEMENT_DATA: LocationListInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  show: boolean = true;
  action: string = 'action';
  searchParam: string = '';

  dataSource: MatTableDataSource<LocationListInterface> = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  ngOnInit() {
    this.loadData();
    this.getCategories();
    this.getOsVersions();
    this.getPatchingDays();
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;
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

  loadData() {
    this.isLoading = true;
    let pageAdd = this.currentPage + 1;
    this.locationService.fetchLocations(pageAdd, this.pageSize, this.action,this.searchParam).subscribe((res: any) => {
      this.dataSource.data = res.data;     //umcomment this line when api start working
      this.totalRows = res.totalCount;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = res.totalCount;
      });
      this.isLoading = false;
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  selectAction(event: Event){
    const actionValue = (event.target as HTMLOptionElement).value;
    this.action = actionValue;
    this.isLoading = true;
    this.loadData();
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  editLocation(row: LocationListInterface) {
    this.locationService.editRowData = row;
    sessionStorage.setItem('editLocationItem',JSON.stringify(this.locationService.editRowData))
    localStorage.setItem('locId', this.locationService.editRowData.id);
    this.router.navigate(['/pages/editlocation', row.id], { relativeTo: this.route });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchParam = filterValue;
    this.loadData();
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewLocation() {
    this.router.navigate(['/pages/addnewlocation'], { relativeTo: this.route });
    this.show = false;
  }

  getRowLocData: any;
  deleteLocation(rowData: any) {
    this.getRowLocData = rowData;
  }

  popupConfirmButton() {
    let deleteObj = {
      Id: +this.getRowLocData.id,
      Loc_Code: this.getRowLocData.loc_Code,
      Location_Name: this.getRowLocData.location_Name,
      Location_Address: this.getRowLocData.location_Address,
      Ldap_Domain: this.getRowLocData.ldap_Domain,
      Ldap_Container: this.getRowLocData.ldap_Container,
      Id_Region: +this.getRowLocData.id_Region,
      Pictures: this.getRowLocData.pictures,
      Architecture_Diagram: this.getRowLocData.architecture_Diagram,
      Country: this.getRowLocData.country,
      CU_Number: this.getRowLocData.cU_Number,
      CC_Number: this.getRowLocData.cC_Number,
      Timezone: this.getRowLocData.timezone,
      BMC_Group: this.getRowLocData.bmC_Group
    }
    this.locationService.deleteLocation(deleteObj).subscribe(deleteLoc => {
      this.openSnackBar('Location has been Deleted Successfully');
    }, error => {
      this.openSnackBar('Something went wrong. Please try after some time');
    });
  }

  getCategories(){
    let pageAdd = this.currentPage + 1;
    this.locationService.fetchCategories(pageAdd, this.pageSize).subscribe(res =>{
      localStorage.setItem('categories', JSON.stringify(res))
    })
  }

  getPatchingDays(){
    let pageAdd = this.currentPage + 1;
    this.locationService.fetchPatchingDays(pageAdd, this.pageSize).subscribe(res =>{
      localStorage.setItem('patchingDays', JSON.stringify(res))

    })
  }

  getOsVersions(){
    let pageAdd = this.currentPage + 1;
    this.locationService.fetchOsVersions(pageAdd, this.pageSize).subscribe(res =>{
      localStorage.setItem('osVersions', JSON.stringify(res))
    })
  }

  viewLocation(row: LocationListInterface) {
    this.locationService.editRowData = row;
    localStorage.setItem('locId', this.locationService.editRowData.id);
    this.router.navigate(['/pages/viewlocation', row.id], { relativeTo: this.route });
  }

}

