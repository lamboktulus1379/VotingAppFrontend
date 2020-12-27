import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
@NgModule({
  providers: [JwtModule],
  imports: [
    JwtModule
  ]
})
export class AuthGuardService implements CanActivate {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  constructor( private router: Router, private http: HttpClient) { }
  public async canActivate() {
    const token = localStorage.getItem("jwt");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if (!isRefreshSuccess) {
      this.router.navigate(["login"]);
    }
    return false;
  }
  private async tryRefreshingTokens(token: string) {
    const refreshToken = localStorage.getItem("refreshToken");
    const credentials = JSON.stringify({accessToken: token, refreshToken: refreshToken});

    let isRefreshSuccess: boolean;

    try {
      const response = await this.http.post("https://localhost:5000/api/token/refresh", credentials, {
        headers: new HttpHeaders({
          'ContentType': "application/json",
          "Accept": "application/json"
        }),
        observe: 'response'
      }).toPromise();

      const newToken = (<any>response).body.accessToken;
      const newRefreshToken = (<any>response).body.refreshToken;
      localStorage.setItem("jwt", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      isRefreshSuccess = true;
      
    } catch (error) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }
}
