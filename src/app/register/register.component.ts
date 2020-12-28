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
import { UserForCreation } from '../_interfaces/userForCreation.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
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
  
    this.registerForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required,  Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/g)]),
      Age: new FormControl('', [Validators.required, Validators.min(7)]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
      Gender: new FormControl('', [Validators.required]),
      LastName: new FormControl('')
    });
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {
        
      }
    }

   
  }
  public registerForm: FormGroup;

  public hasError = (controlName: string, errorName: string)=> {
    return this.registerForm.controls[controlName].hasError(errorName);
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

  public executeRegisterUser(registerFormValue: any) {
    let user: UserForCreation = {
      Email: registerFormValue.Email,
      Password: registerFormValue.Password,
      Age: registerFormValue.Age,
      FirstName: registerFormValue.FirstName,
      Gender: registerFormValue.Gender,
      LastName: registerFormValue.LastName
    }

    let apiUrl = 'api/auth/register';

    this.repository.create(apiUrl, user).subscribe(res => {
      const token = (<any>res).token;
      const refreshToken = (<any>res).refreshToken;
      localStorage.setItem("jwt", token);
      localStorage.setItem("refreshToken", refreshToken);

      this.invalidLogin = false;
      this.router.navigate(["/"]);
      console.log("Success Login");
      
    },(error) => {
      console.log("Error: ", error);
     
      this.errorService.dialogConfig = {...this.dialogConfig}
      this.errorService.handleError(error);
    })
  }
  public registerUser = (registerFormValue: any) => {
    if (this.registerForm.valid) {
      this.executeRegisterUser(registerFormValue);
    }
  }
}
