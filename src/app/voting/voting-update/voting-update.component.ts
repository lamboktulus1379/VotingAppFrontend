import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Location} from "@angular/common";
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { votingForUpdate } from 'src/app/_interfaces/votingForUpdate.model';
import { MatDialog } from "@angular/material/dialog";
import { SuccessDialogComponent } from 'src/app/shared/dialogs/success-dialog/success-dialog.component';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Category } from 'src/app/_interfaces/category.model';
import { ActivatedRoute } from '@angular/router';
import { Voting } from 'src/app/_interfaces/voting.model';

@Component({
  selector: 'app-voting-update',
  templateUrl: './voting-update.component.html',
  styleUrls: ['./voting-update.component.scss']
})
export class VotingUpdateComponent implements OnInit {
  private dialogConfig;

  public categories:  Category[];
  public voting: Voting;
  public votingId: string = "";

  public votingForm: FormGroup;
  constructor(private location: Location, private repository: RepositoryService, private dialog: MatDialog, private errorService: ErrorHandlerService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.votingForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      Description: new FormControl(''),
      VotersCount: new FormControl(0, [Validators.required]),
      DueDate: new FormControl(currentDate.toISOString()),
      CategoryId: new FormControl('', Validators.required)
    })

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    }    
    this.getVotingById();
    this.getAllCategories();
  }
  private getVotingById = () =>{
    this.votingId = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/votings/${this.votingId}`;
 
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.voting = res.body as Voting;

      this.votingForm.patchValue(this.voting);
    },
    (error) =>{
      this.errorHandler.handleError(error);
    })
  }

  public getAllCategories = () => {
    this.repository.getData(`api/categories`)
    .subscribe(res => {
      this.categories = res.body as Category[]; 
      console.log(res);
    }, (error) => {
      this.errorService.handleError(error)
    })
  }

  public executeVotingUpdate(votingFormValue: any) {
    let voting: votingForUpdate = {
      Name: votingFormValue.Name,
      Description: votingFormValue.Description,
      VotersCount: votingFormValue.VotersCount,
      DateCreated: new Date(),
      DueDate: votingFormValue.DueDate,
      CategoryId: votingFormValue.CategoryId,
    }

    let apiUrl = `api/votings/${this.votingId}`;

    this.repository.update(apiUrl, voting).subscribe(res => {
      let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig)
      dialogRef.afterClosed()
      .subscribe(result => {        
        this.location.back();
      });
      
    },(error) => {
      this.errorService.dialogConfig = {...this.dialogConfig}
      this.errorService.handleError(error);
    })
  }

  public hasError = (controlName: string, errorName: string)=> {
    return this.votingForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
    this.location.back();
  }

  public updateVoting = (votingFormValue: any) => {
    if (this.votingForm.valid) {
      this.executeVotingUpdate(votingFormValue);
    }
  }
}
