import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { Voting } from 'src/app/_interfaces/voting.model';

@Component({
  selector: 'app-voting-details',
  templateUrl: './voting-details.component.html',
  styleUrls: ['./voting-details.component.scss']
})
export class VotingDetailsComponent implements OnInit {
  public voting: Voting;

  constructor(private repository: RepositoryService, 
    private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getVotingDetails();
  }
  private getVotingDetails = () =>{
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/votings/${id}`;
 
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.voting = res as Voting;
    },
    (error) =>{
      this.errorHandler.handleError(error);
    })
  }
}
