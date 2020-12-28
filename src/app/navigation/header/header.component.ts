import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit(); 
  }
  logout() {
    
  }

  login() {
    
  }
  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }
}
