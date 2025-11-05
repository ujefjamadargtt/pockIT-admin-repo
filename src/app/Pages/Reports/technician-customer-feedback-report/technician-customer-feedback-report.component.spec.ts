import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianCustomerFeedbackReportComponent } from './technician-customer-feedback-report.component';

describe('TechnicianCustomerFeedbackReportComponent', () => {
  let component: TechnicianCustomerFeedbackReportComponent;
  let fixture: ComponentFixture<TechnicianCustomerFeedbackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianCustomerFeedbackReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianCustomerFeedbackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
