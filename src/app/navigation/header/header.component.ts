import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  constructor(private jwtHelper: JwtHelperService, private route: Router) { }

  ngOnInit(): void {
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit(); 
  }
  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");

    this.route.navigate(['/login']);
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
