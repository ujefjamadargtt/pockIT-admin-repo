import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bCustomerServiceSummeryReportComponent } from './b2b-customer-service-summery-report.component';

describe('B2bCustomerServiceSummeryReportComponent', () => {
  let component: B2bCustomerServiceSummeryReportComponent;
  let fixture: ComponentFixture<B2bCustomerServiceSummeryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2bCustomerServiceSummeryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bCustomerServiceSummeryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
