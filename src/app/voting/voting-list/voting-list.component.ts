import { AfterViewInit, Component, ErrorHandler, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { Voting } from 'src/app/_interfaces/voting.model';
import { MatSort } from "@angular/material/sort"
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Router } from "@angular/router";
import {ConfirmDialogComponent  } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/_interfaces/category.model';
import { Page } from 'src/app/_interfaces/page.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-voting-list',
  templateUrl: './voting-list.component.html',
  styleUrls: ['./voting-list.component.scss']
})


export class VotingListComponent implements OnInit, AfterViewInit {
  public categories: Category[];
  public currentVotings:Voting[] = [];
  public categorySelected =  new Set();
  public order: string;
  public whereIn: string;
  public loading: boolean=false;
  public page: Page;
  public pageSize: number = 10;
  public pageIndex: number= 0;
  public pageNumber: number= 1;
  public defaultUrl: string= `api/votings?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`;
  public displayedColumns = ['name', 'description', 'dateCreated', 'votersCount', 'dueDate', 'categories', 'details', 'update', 'delete']

  public dataSource = new MatTableDataSource<Voting>();

  @ViewChild(MatSort)sort: MatSort;
  @ViewChild(MatPaginator)paginator: MatPaginator;

  private dialogConfig;
  
  constructor(private repoService: RepositoryService, private http: HttpClient, private errorService: ErrorHandlerService,  private router: Router, private dialog: MatDialog) {
    this.order = "DateCreated desc";
   }
   
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;    
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getVotings();
    this.getAllCategories();

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: false,
      data: {}
    }
  }


  public getVotings = () => {
    this.loading = true;
    this.repoService.getData(this.defaultUrl)
    .subscribe(res => {
      let dt:Voting[] = res.body as Voting[];
     this.currentVotings.push(...dt);
     this.dataSource.data = dt;
      
      this.page =  JSON.parse(res.headers.get("x-pagination")) as Page;
      this.pageIndex = parseInt(this.page.CurrentPage) -1;

      console.log(this.page);
      this.loading = false;      
    }, (error) => {
      this.errorService.handleError(error)
    })

    // this.http.get<any>(`https://localhost:5000/${this.defaultUrl}`, {observe: 'response',headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json'})}).subscribe(res => {
    //   console.log(res.headers);
    // })
  }
  public getAllCategories = () => {
    this.repoService.getData(`api/categories`)
    .subscribe(res => {
      this.categories = res.body as Category[]; 
    }, (error) => {
      this.errorService.handleError(error)
    })
  }

  customeSort = (event : any) => {
    if (event.active == "categories") {
      this.dataSource.sort = this.sort;
      return;
    }
    
    
    this.order = `${event.active} ${event.direction}`;
    this.defaultUrl = `api/votings?orderBy=${this.order}`
    this.getVotings();
  }

  public redirectToDetails = (id: string) => {
    let url: string = `voting/details/${id}`
    this.router.navigate([url]);
  }

  public redirectToUpdate = (id: string) => {
    const updateUrl: string = `/voting/update/${id}`
    this.router.navigate([updateUrl]);
  }

  public redirectToDelete = (id: string) => {
    
    let dialogRef = this.dialog.open(ConfirmDialogComponent, this.dialogConfig)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let deleteUrl: string = `api/votings/${id}`
        this.repoService.delete(deleteUrl).subscribe(res => {
          this.getVotings();
        }, (error) => {
          this.errorService.dialogConfig = {...this.dialogConfig}
          this.errorService.handleError(error);
        })
      }
    })

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  public pageChanged = (event: any) => {
    console.log(event);
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.defaultUrl = `api/votings?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`;
    this.getVotings();
  }

  public getChecked(e:boolean, idx:number) {    
   let id =  this.categories[idx].Id
    if (this.categorySelected.has(id)) {
      this.categorySelected.delete(id);
    } else {
      this.categorySelected.add(id);
    }
    if (this.categorySelected.size > 0) {
      this.whereIn = Array.from(this.categorySelected).join(",").trim();
      this.defaultUrl = `api/votings?orderBy=${this.order}&whereIn=${this.whereIn}`
    } else {
      this.defaultUrl = `api/votings?orderBy=${this.order}`
    }
    this.getVotings();
  }
}
