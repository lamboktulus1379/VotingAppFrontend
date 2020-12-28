import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HeaderComponent } from './navigation/header/header.component'
import { MaterialModule } from './material/material.module';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { VotingModule } from './voting/voting.module';
import { CategoryModule } from './category/category.module';
import { ServerErrorComponent } from './error-pages/server-error/server-error.component';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    InternalServerComponent,
    NotFoundComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavListComponent,
    ServerErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    VotingModule,
    CategoryModule,
    RouterModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5000"],
        disallowedRoutes: []
      }
    })
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
