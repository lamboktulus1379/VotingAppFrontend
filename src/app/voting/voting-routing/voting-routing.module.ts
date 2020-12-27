import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VotingListComponent } from '../voting-list/voting-list.component';

const routes: Routes = [
  {path: 'votings', component: VotingListComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class VotingRoutingModule { }
