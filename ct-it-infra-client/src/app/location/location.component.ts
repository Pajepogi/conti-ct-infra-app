import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  constructor(private locationService: LocationService, private authService: AuthorizationService) { }
  toggle = true;
  boolCondition: boolean = true;
  settings: any = localStorage.getItem('userRole');
  enableDisableRule() {
    this.toggle = !this.toggle;
  }

  ngOnInit(): void {

  }

  togleClas: boolean = false
  toggleClass() {
    this.togleClas = true
    return this.togleClas;
  }

}
