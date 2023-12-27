import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, AfterViewInit {
  settings: any = false;
  authRes: any;
  invertImg: boolean = false;
  invertCaret: boolean = false;
  panelOpenState: boolean = false;
  locationActive: boolean = false;
  userPage: any;
  categoryPage: any;
  osNamePage: any;
  patchingDayPage: any;
  currentUrl: any;
  lastSegment: any;
  activeSubmenu: {};
  submenuItems = [
    { content: "User Master", 'method': '../pages/user' },
    { content: "Category", 'method': '../pages/category' },
    { content: "OS Name", 'method': '../pages/operatingSystem' },
    { content: "Patching Day", 'method': '../pages/patchingDay' },
    // { content : "My Profile" , 'method': '../pages/profile'},
  ];
  constructor(private authorizationService: AuthorizationService) {
    this.authorizationService.UserRoles.subscribe(userRole => {
      this.settings = userRole.RoleName
    })
  }
  toggle = true;
  activeProjectIndex: boolean = false;
  enableDisableRule() {
    this.toggle = !this.toggle;
  }

  ngOnInit() {
    this.currentUrl = window.location.href;
    this.lastSegment = this.currentUrl.split("/").pop();

    if (this.lastSegment == "pages" || this.lastSegment == "locationlist" || this.currentUrl?.includes('editlocation') || this.currentUrl?.includes('viewlocation')) {
      this.locationActive = true;
      this.removeStyle();
    } else {
      this.changeBackTab();
    }

  }

  ngAfterViewInit() {
    this.userPage = document.getElementById('User Master');
    this.categoryPage = document.getElementById('Category');
    this.osNamePage = document.getElementById('OS Name');
    this.patchingDayPage = document.getElementById('Patching Day');
    this.getClass(this.lastSegment);
  }


  changeBackTab() {
    this.activeProjectIndex = true;
    this.invertImg = true;
    this.invertCaret = true;
    this.locationActive = false;
    this.panelOpenState = true;
    this.clearClass();
  }

  removeStyle() {
    this.activeProjectIndex = false;
    this.invertImg = false;
    this.invertCaret = false;
    this.panelOpenState = false;
    this.locationActive = true;
  }

  clearClass() {
    this.userPage?.classList.remove('activeSubmenuColor');
    this.categoryPage?.classList.remove('activeSubmenuColor');
    this.osNamePage?.classList.remove('activeSubmenuColor');
    this.patchingDayPage?.classList.remove('activeSubmenuColor');
  }

  getClass(lastSegment: any) {
    if (lastSegment == "user") {
      this.userPage?.classList.add('activeSubmenuColor');
    }
    if (lastSegment == "category") {
      this.categoryPage?.classList.add('activeSubmenuColor');
    }
    if (lastSegment == "operatingSystem") {
      this.osNamePage?.classList.add('activeSubmenuColor');
    }
    if (lastSegment == "patchingDay") {
      this.patchingDayPage?.classList.add('activeSubmenuColor');
    }
  }

}
