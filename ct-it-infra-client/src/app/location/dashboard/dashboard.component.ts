import { Component, OnInit } from '@angular/core';
import { AuthorizeInterface } from 'src/app/interfaces/authorize-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  userRole!: AuthorizeInterface;


  ngOnInit(){
    
  }

}
