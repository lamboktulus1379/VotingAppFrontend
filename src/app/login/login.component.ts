import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import {EnvironmentUrlService} from 'src/app/shared/services/environment-url.service'
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { SuccessDialogComponent } from '../shared/dialogs/success-dialog/success-dialog.component';
import { userForLogin } from '../_interfaces/userForLogin.model';
import { MatDialog } from '@angular/material/dialog';
import { RepositoryService } from '../shared/services/repository.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
  private dialogConfig;
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  public invalidLogin: boolean = true;

  constructor(
    private router: Router,
    private errorService: ErrorHandlerService,
    private repository: RepositoryService,
    private jwtHelper: JwtHelperService,
  ) {}

  ngOnInit(): void {
    if (this.isUserAuthenticated()) {
      this.router.navigate(['/home']);
    }
  
    this.loginForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required])
    });
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {
        
      }
    }

   
  }
  public loginForm: FormGroup;

  public hasError = (controlName: string, errorName: string)=> {
    return this.loginForm.controls[controlName].hasError(errorName);
  }
  isUserAuthenticated() {
    let token: string = "";
    token = localStorage.getItem("jwt") || "";
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  public executeLoginUser(loginFormValue: any) {
    let user: userForLogin = {
      Email: loginFormValue.Email,
      Password: loginFormValue.Password
    }

    let apiUrl = 'api/auth/login';

    this.repository.create(apiUrl, user).subscribe(res => {
      const token = (<any>res).token;
      const refreshToken = (<any>res).refreshToken;
      const id = (<any>res).id;
      localStorage.setItem("jwt", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem('id', id);

      this.invalidLogin = false;
      this.router.navigate(["/"]);
      console.log("Success Login");
      
    },(error) => {
      console.log("Error: ", error);
     
      this.errorService.dialogConfig = {...this.dialogConfig}
      this.errorService.handleError(error);
    })
  }
  public loginUser = (loginFormValue: any) => {
    if (this.loginForm.valid) {
      this.executeLoginUser(loginFormValue);
    }
  }
}
