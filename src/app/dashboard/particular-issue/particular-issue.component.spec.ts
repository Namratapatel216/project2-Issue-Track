import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularIssueComponent } from './particular-issue.component';

describe('ParticularIssueComponent', () => {
  let component: ParticularIssueComponent;
  let fixture: ComponentFixture<ParticularIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticularIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticularIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
