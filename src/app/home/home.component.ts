import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { RepositoryService } from '../shared/services/repository.service';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public currentVotings:Voting[] = [];
  public categorySelected =  new Set();
  public order: string = "";
  public whereIn: string = "";
  public Name: string = "";
  public loading: boolean=false;
  public page: Page = {};
  public pageSize: number = 10;
  public pageIndex: number= 0;
  public pageNumber: number= 1;
  public dateNow= new Date().getTime() % 1000;
  public defaultUrl: string= `api/votings?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}&Name=${this.Name}`;
  
  constructor(
    public jwtHelper: JwtHelperService, 
    private repository: RepositoryService,
    private errorService: ErrorHandlerService,
    private router: Router) { }

 
  ngOnInit(): void {
    this.getVotings();
    console.log(this.dateNow);
  }
  public executeSelectedChange = (event : any) => {
    
  }

  public getVotings = (push: boolean = true) => {
    this.loading = true;
     this.repository.getData(this.defaultUrl)
    .subscribe(res => {
      let dt:Voting[] = res.body as Voting[];
      if (!push) {
        this.defaultUrl = `api/votings`
        this.currentVotings = dt;
      }
     
      else {
        this.currentVotings.push(...dt);
      }

     this.currentVotings.map(e => {
      let d = e;
      e.DueDate = new Date(e.DueDate).getTime() % 1000;
      return d;
     });
     console.log(this.currentVotings);
      
      this.page =  JSON.parse(res.headers.get("x-pagination")) as Page;

      this.loading = false;      
    }, (error) => {
      this.errorService.handleError(error)
    })
  }
  redirectToDetail(id: string) {
    this.router.navigate([`voting/${id}`]);
  }
  loadMore() {
    this.pageNumber++;
    this.defaultUrl = `api/votings?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}&Name=${this.Name}`;
    this.getVotings();
    console.log(this.pageNumber);
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
  userVote(idx : number) {
    if (!this.isUserAuthenticated) {
      alert("Login for Vote");
      return;
    }
    let id = this.currentVotings[idx].Id;
    let idUser = localStorage.getItem("id");
    this.repository.create(`api/users/${idUser}/votes/${id}`, {}).subscribe(res => {
      console.log("Response: ", res);
      this.getVotings(false);
    });
  }
}
