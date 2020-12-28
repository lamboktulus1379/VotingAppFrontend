import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Location} from "@angular/common";
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { votingForCreation } from 'src/app/_interfaces/votingForCreation.model';
import { MatDialog } from "@angular/material/dialog";
import { SuccessDialogComponent } from 'src/app/shared/dialogs/success-dialog/success-dialog.component';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Category } from 'src/app/_interfaces/category.model';

@Component({
  selector: 'app-voting-create',
  templateUrl: './voting-create.component.html',
  styleUrls: ['./voting-create.component.scss']
})
export class VotingCreateComponent implements OnInit {
  private dialogConfig;

  public categories:  Category[];

  public votingForm: FormGroup;
  constructor(private location: Location, private repository: RepositoryService, private dialog: MatDialog, private errorService: ErrorHandlerService) { }

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
    this.getAllCategories();
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

  public executeVotingCreation(votingFormValue: any) {
    let voting: votingForCreation = {
      Name: votingFormValue.Name,
      Description: votingFormValue.Description,
      VotersCount: votingFormValue.VotersCount,
      DateCreated: new Date(),
      DueDate: votingFormValue.DueDate,
      CategoryId: votingFormValue.CategoryId
    }

    let apiUrl = 'api/votings';

    this.repository.create(apiUrl, voting).subscribe(res => {
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

  public createVoting = (votingFormValue: any) => {
    if (this.votingForm.valid) {
      this.executeVotingCreation(votingFormValue);
    }
  }
}
