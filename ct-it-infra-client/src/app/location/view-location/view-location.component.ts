import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.css']
})
export class ViewLocationComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
  ){}

  locationId: any;
  locName: string = '';
  editRowData: any;
  viewLocationForm: FormGroup;
  isDisabled: boolean = true;
  isLocActive: boolean = false;

  ngOnInit(): void{
    const locationSideMenu = document.getElementById('locationSideMenu');
    locationSideMenu?.classList.add('active');

    this.route.paramMap.subscribe(params => {
      this.locationId = params.get('id');
      console.log(this.locationService.editRowData);
      this.viewLocationForm = this.fb.group({
        locationCode: [this.locationService.editRowData.loc_Code, ''],
        locationName: [this.locationService.editRowData.location_Name, ''],
        locationAddress: [this.locationService.editRowData.location_Address, ''],
        ldapDomain: [this.locationService.editRowData.ldap_Domain, ''],
        ldapContainer: [this.locationService.editRowData.ldap_Container, ''],
        region: [this.locationService.editRowData.region.name, ''],
        country: [this.locationService.editRowData.country, ''],
        cuNumber: [this.locationService.editRowData.cU_Number, ''],
        ccNumber: [this.locationService.editRowData.cC_Number, ''],
        timezone: [this.locationService.editRowData.timezone, ''],
        bmcGroup: [this.locationService.editRowData.bmC_Group, ''],
      });
    });
    this.viewLocationForm.disable();
  }

}
