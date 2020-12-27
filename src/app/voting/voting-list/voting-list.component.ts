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

@Component({
  selector: 'app-voting-list',
  templateUrl: './voting-list.component.html',
  styleUrls: ['./voting-list.component.scss']
})


export class VotingListComponent implements OnInit, AfterViewInit {

  public order: string;
  public displayedColumns = ['name', 'description', 'dateCreated', 'votersCount', 'dueDate', 'categories', 'details', 'update', 'delete']

  public dataSource = new MatTableDataSource<Voting>();

  @ViewChild(MatSort)sort: MatSort;
  @ViewChild(MatPaginator)paginator: MatPaginator;

  private dialogConfig;
  
  constructor(private repoService: RepositoryService, private errorService: ErrorHandlerService,  private router: Router, private dialog: MatDialog) {
    this.order = "DateCreated desc";
   }
   
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;    
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getVotings();

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: false,
      data: {}
    }
  }

  public getVotings = () => {
    this.repoService.getData(`api/votings?orderBy=${this.order}`)
    .subscribe(res => {
      this.dataSource.data = res as Voting[]; 
      console.log(res);
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
  }
}
