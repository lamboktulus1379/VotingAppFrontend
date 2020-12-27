import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingUpdateComponent } from './voting-update.component';

describe('VotingUpdateComponent', () => {
  let component: VotingUpdateComponent;
  let fixture: ComponentFixture<VotingUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
