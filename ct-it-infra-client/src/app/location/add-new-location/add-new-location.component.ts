import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { regions } from 'src/app/interfaces/getLocation.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { TimeZones } from 'src/app/shared/enums/timezones';
import { Countries } from 'src/app/shared/enums/countries';
import { Domains } from 'src/app/shared/enums/domains';


@Component({
  selector: 'app-add-new-location',
  templateUrl: './add-new-location.component.html',
  styleUrls: ['./add-new-location.component.css']
})
export class AddNewLocationComponent implements OnInit {
  formSubmitAlert: boolean = false
  empId: string | null;
  constructor(private fb: FormBuilder,
    private locationService: LocationService,
    private route: ActivatedRoute,
     private router: Router,
     private _snackBar: MatSnackBar
     ) { }

  addNewLocationForm: FormGroup;
  regionsDropdown: any;
  editRowData: any;
  reqObj: any;
  message: string;
  locationId: string ='';
  changeText:boolean = false;
  locName: string = '';
  timeZones: any;
  countries: any;
  ldapDomain: any;
  FormsAvailability: boolean = true;

  ngOnInit(): void {
    const locationSideMenu = document.getElementById('locationSideMenu');
    locationSideMenu?.classList.add('active');

    this.locationService.fetchRegions().subscribe(regionData => {
      this.regionsDropdown = regionData;
      if (this.empId && this.editRowData) {
        let regionValue = this.regionsDropdown.filter((e: any) => e.id == this.editRowData.regionId);
        this.addNewLocationForm.controls['region'].setValue(regionValue[0].id);
      }

      this.timeZones = Object.values(TimeZones);
      this.timeZones.sort();

      this.countries = Object.values(Countries);
      this.countries.sort();

      this.ldapDomain = Object.values(Domains);
      this.ldapDomain.sort();

    });

    this.addNewLocationForm = this.fb.group({
      locationCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      locationName: ['', [Validators.required, Validators.maxLength(200)]],
      locationAddress: ['', [Validators.required, Validators.maxLength(500)]],
      ldapDomain: ['', Validators.required],
      ldapContainer: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      cuNumber: ['', Validators.required],
      ccNumber: ['', Validators.required],
      timeZone: ['', Validators.required],
      bmcGroup: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      this.empId = params.get('id');
      if(this.empId){
        this.FormsAvailability = true;
        this.addNewLocationForm.reset();
        let editLocationItem = JSON.parse(sessionStorage.getItem('editLocationItem')!);
        if(this.empId == editLocationItem.id.toString()){
          this.editRowData = editLocationItem;
          this.locationId = this.editRowData.id;
          this.locName = this.editRowData.location_Name;
          this.editLocation(this.editRowData);
        }else{
          this.openSnackBar('Something went wrong. Please try after some time');
          this.FormsAvailability = false;
        }
      }
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

  editLocation(editData: any) {
    this.changeText = true;
    this.addNewLocationForm.patchValue({
      locationCode: editData.loc_Code,
      locationName: editData.location_Name,
      locationAddress: editData.location_Address,
      ldapDomain: editData.ldap_Domain,
      ldapContainer: editData.ldap_Container,
      region: editData.region,
      country: editData.country,
      cuNumber: editData.cU_Number,
      ccNumber: editData.cC_Number,
      timeZone: editData.timezone,
      bmcGroup: editData.bmC_Group
    });
  }

  get locationcode(): any { return this.addNewLocationForm.get('locationCode'); }
  get locationname(): any { return this.addNewLocationForm.get('locationName'); }
  get locationaddress(): any { return this.addNewLocationForm.get('locationAddress'); }
  get ldapdomain(): any { return this.addNewLocationForm.get('ldapDomain'); }
  get ldapcontainer(): any { return this.addNewLocationForm.get('ldapContainer'); }
  get cunumber(): any { return this.addNewLocationForm.get('cuNumber'); }
  get timezone(): any { return this.addNewLocationForm.get('timeZone'); }
  get ccnumber(): any { return this.addNewLocationForm.get('ccNumber'); }
  get bmcgroup(): any { return this.addNewLocationForm.get('bmcGroup'); }
  get region(): any { return this.addNewLocationForm.get('region'); }
  get country(): any { return this.addNewLocationForm.get('country'); }



  //Method on click of save
  saveLocation() {
    if (this.addNewLocationForm.status == 'INVALID') {
      this.openSnackBar('You entered invalid values in form');
    } else {
      this.reqObj = {
        Id: 0,
        Loc_Code: this.addNewLocationForm.value.locationCode,
        Location_Name: this.addNewLocationForm.value.locationName,
        Location_Address: this.addNewLocationForm.value.locationAddress,
        Ldap_Domain: this.addNewLocationForm.value.ldapDomain,
        Ldap_Container: this.addNewLocationForm.value.ldapContainer,
        regionId: +this.addNewLocationForm.value.region,
        Pictures: null,
        Architecture_Diagram: null,
        Country: this.addNewLocationForm.value.country,
        CU_Number: this.addNewLocationForm.value.cuNumber,
        CC_Number: this.addNewLocationForm.value.ccNumber,
        Timezone: this.addNewLocationForm.value.timeZone,
        BMC_Group: this.addNewLocationForm.value.bmcGroup
      }
      if (this.empId) {
        this.reqObj.Id = parseInt(this.empId);
        this.updateLocation(this.reqObj);
      } else {
        this.addNewLocation(this.reqObj);
      }
    }
  }

  addNewLocation(reqObj: any) {
    this.locationService.addLocation(reqObj).subscribe(res => {
       this.openSnackBar('Location has been added Successfully');
       this.locationService.editRowData = res;
       this.router.navigate(['../pages/editlocation/'+ res.id]);
    }, error => {
      this.openSnackBar("Something went wrong. Please try after some time");
    })
  }

  updateLocation(reqObj: any) {
    reqObj.id = this.locationId;
    this.locationService.updateLocation(reqObj).subscribe(res => {
      this.changeText = false;
      this.openSnackBar('Location has been Updated Successfully');
    }, error => {
      this.formSubmitAlert = false;
      this.openSnackBar('Something went wrong. Please try after some time');
    })
  }

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
}
