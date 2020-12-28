import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
  }
  public executeSelectedChange = (event : any) => {
    console.log(event);
  }
}
