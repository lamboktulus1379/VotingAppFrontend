import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotingListComponent } from './voting-list/voting-list.component';
import { VotingRoutingModule } from './voting-routing/voting-routing.module';
import {MaterialModule} from './../material/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [VotingListComponent],
  imports: [
    CommonModule,
    VotingRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class VotingModule { }
