import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAssignmentReportComponent } from './job-assignment-report.component';

describe('JobAssignmentReportComponent', () => {
  let component: JobAssignmentReportComponent;
  let fixture: ComponentFixture<JobAssignmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAssignmentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobAssignmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
