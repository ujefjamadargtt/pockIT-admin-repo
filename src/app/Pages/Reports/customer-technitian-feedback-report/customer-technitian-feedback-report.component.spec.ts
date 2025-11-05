import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTechnitianFeedbackReportComponent } from './customer-technitian-feedback-report.component';

describe('CustomerTechnitianFeedbackReportComponent', () => {
  let component: CustomerTechnitianFeedbackReportComponent;
  let fixture: ComponentFixture<CustomerTechnitianFeedbackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTechnitianFeedbackReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTechnitianFeedbackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
