import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(private router: Router, private locSer: LocationService) { }
  activeProjectIndex: boolean;
  settings: any = localStorage.getItem('userRole');
  ngOnInit(): void {

  }

  userNavigation() {
    this.router.navigate(['/userlist'])
  }


}
