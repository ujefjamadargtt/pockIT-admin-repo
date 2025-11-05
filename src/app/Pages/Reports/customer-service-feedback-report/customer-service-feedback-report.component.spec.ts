import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceFeedbackReportComponent } from './customer-service-feedback-report.component';

describe('CustomerServiceFeedbackReportComponent', () => {
  let component: CustomerServiceFeedbackReportComponent;
  let fixture: ComponentFixture<CustomerServiceFeedbackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServiceFeedbackReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServiceFeedbackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
