import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import {EnvironmentUrlService} from 'src/app/shared/services/environment-url.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  public invalidLogin: boolean = true;

  constructor(
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private router: Router,
    private environmentUrlService: EnvironmentUrlService,
  ) {}

  ngOnInit(): void {
    
  }

  login(form: NgForm) {
    const credentials = JSON.stringify(form.value);
    let apiAddress = `/api/auth/login`;
    this.http.post(`${this.environmentUrlService.urlAddress}${apiAddress}`, credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      const token = (<any>response).token;
      const refreshToken = (<any>response).refreshToken;
      localStorage.setItem("jwt", token);
      localStorage.setItem("refreshToken", refreshToken);

      this.invalidLogin = false;
      this.router.navigate(["/"]);
    }, () => {
      this.invalidLogin = true;
    });
  }
}
