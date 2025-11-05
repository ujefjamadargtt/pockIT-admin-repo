import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWiseTicketsRaisedreportComponent } from './job-wise-tickets-raisedreport.component';

describe('JobWiseTicketsRaisedreportComponent', () => {
  let component: JobWiseTicketsRaisedreportComponent;
  let fixture: ComponentFixture<JobWiseTicketsRaisedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobWiseTicketsRaisedreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobWiseTicketsRaisedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
