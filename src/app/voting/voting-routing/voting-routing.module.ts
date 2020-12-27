import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VotingListComponent } from '../voting-list/voting-list.component';
import { VotingCreateComponent } from '../voting-create/voting-create.component';

const routes: Routes = [
  {path: 'votings', component: VotingListComponent},
  {path: 'create', component: VotingCreateComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class VotingRoutingModule { }
