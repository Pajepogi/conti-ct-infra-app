import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';

import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { roles, userLocationData, users } from 'src/app/interfaces/getLocation.interface';
import { LocationListInterface } from 'src/app/interfaces/location-list.interface';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';
import { __values } from 'tslib';
import { GraphApiService as GraphApiService } from 'src/app/services/graphApi.service';
import { User } from 'src/app/shared/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  rearchResultTable: boolean = false;
  roles: any;
  deleteUserData: any;
  editUserData: any;
  searchUserForm: FormGroup;
  reqObj: any;
  searchUserList: any = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private graphApiService: GraphApiService
  ) { }

  displayedColumns = ['empid', 'mailAddress', 'roles', 'locations', 'action'];
  ELEMENT_DATA: LocationListInterface[] = [];
  isLoading = false;
  totalRows!: number;
  pageSize = 25;
  currentPage = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200, 250];
  show: boolean = true;
  formSubmitAlert: boolean = false
  message: string;
  dataSource: MatTableDataSource<userRecord> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  settings: any;
  ngOnInit() {
    this.loadData();
    this.paginator._intl.itemsPerPageLabel = "Show";
    this.paginator._intl.getRangeLabel = this.getRangeDisplayText;

    this.searchUserForm = this.fb.group({
      employeeId: ['', Validators.minLength(5)],
      emailAddress: ['', Validators.email],
    });
  }

  get employeeId(): any { return this.searchUserForm.get('employeeId'); }
  get emailAddress(): any { return this.searchUserForm.get('emailAddress'); }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getRoles();
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

    this.userService.getUserList().subscribe((usersArray: users[]) => {
      this.userService.getLocationForUsers(usersArray).subscribe(
        (userLocationsData : userLocationData[]) =>  {
          let userRecords : userRecord[] = [];
          for (let index = 0; index < usersArray.length; index++) {
            const user = usersArray[index];
            const userLocationData = userLocationsData.find( x => x.userId == user.userId);
            let locations = userLocationData?.locations.toString();
            let userRecord : userRecord = {
                userId:user.userId,
                roleName: user.roleName,
                email:user.email,
                locations : '' 
            };
            if(locations)
            {
              userRecord.locations = locations;
            }
            userRecords.push(userRecord);
          }
          this.dataSource.data = userRecords;
          this.totalRows = userRecords.length;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = userRecords.length;
          });
          this.isLoading = false;
        }, err => {
          this.openSnackBar('Something went wrong. Please try after some time');
          this.isLoading = false;
        }     
      )
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

  getRoles() {
    this.userService.getUserRoles().subscribe(res => {
      this.roles = res;
    });
  }

  addNewUser() {

  }

  searchUser() {

    if (this.searchUserForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.searchUserList = [];

      this.reqObj = {
        employeeId: this.searchUserForm.value.employeeId,
        emailAddress: this.searchUserForm.value.emailAddress,
      }

      this.rearchResultTable = true;
      this.graphApiService.FetchUsers(this.reqObj.employeeId, this.reqObj.emailAddress).subscribe
        (
          {
            next: (response: any) => {
              let users: User[] = response.value as User[];
              users.forEach(user => {
                this.searchUserList.push({
                  email: user.mail,
                  displayName: user.displayName,
                  empId : user.userPrincipalName.split('@')[0],
                  roleName: ''
                });
              });
            },
            error: (err) => {
              console.log("An error occured while fetching users", err);
            }
          }
        );
    }
  }

  searchResultTabClosed() {
    this.rearchResultTable = false;
  }

  arrowAnimate: boolean = false

  animateArrow() {
    if (this.arrowAnimate == true) {
      this.arrowAnimate = false
    } else if (this.arrowAnimate == false) {
      this.arrowAnimate = true
    }
  }



  roleCheckboxEvent(val: any) {
    let rolename = val.target.value;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i]['roleName'] == rolename) {
        this.addRolesToUserData['roleId'] = this.roles[i]['id'];
      }
    }
  }

  editRoleCheckbox(val: any) {
    let rolename = val.target.value;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i]['roleName'] == rolename) {
        this.editUserData['roleId'] = this.roles[i]['id'];
      }
    }
  }


  deleteUser(userData: any) {
    this.deleteUserData = userData;
  }

  editUser(userData: any) {
    this.editUserData = {
      userId: userData.userId,
      roleId: userData.roleId,
      email: userData.email
    };

  }

  @ViewChild('staticBackdrop3') staticBackdrop3: any;
  @ViewChild('staticBackdrop1') staticBackdrop1: any;
  updateUser() {
    let saveObj = this.editUserData;
    this.staticBackdrop3.nativeElement.checked = false;
    this.userService.updateUser(saveObj).subscribe(saveUser => {
      this.loadData()
      this.openSnackBar('User has been Updated Successfully');
    }, error => {
      this.formSubmitAlert = false;
      this.staticBackdrop3.nativeElement.checked = false;
      this.openSnackBar('User has been Updated Successfully');
      this.loadData()
    });

  }

  saveUser() {
    this.staticBackdrop1.nativeElement.checked = false;
    this.userService.saveUser(this.addRolesToUserData).subscribe(res => {
      this.searchUserList = this.dataSource.data;
      this.openSnackBar('User has been Saved Successfully');
      this.loadData()
    }, error => {
      this.staticBackdrop1.nativeElement.checked = false;
      this.openSnackBar('User has been saved Successfully');
      this.loadData()
    })
  }

  addRolesToUserData: any;
  addUser(userData: any) {
    this.addRolesToUserData = {
      userId: userData.empId,
      roleId: userData.roleId,
      email: userData.email
    };
  }

  deletePopupConfirmButton() {

    let deleteObj = this.deleteUserData;
    this.userService.deleteUser(deleteObj).subscribe(deleteUser => {
      this.formSubmitAlert = true;
      this.openSnackBar('User has been Deleted Successfully');
      this.loadData()
    }, error => {
      console.log("An error occured while deleting user", error);
      this.formSubmitAlert = false;
      this.openSnackBar('User has been Deleted Successfully');
      this.loadData()
    });
    
  }
}

interface userRecord 
{
  userId:string;
  roleName: string;
  email:string;
  locations:string;
}
