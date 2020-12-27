import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingCreateComponent } from './voting-create.component';

describe('VotingCreateComponent', () => {
  let component: VotingCreateComponent;
  let fixture: ComponentFixture<VotingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
