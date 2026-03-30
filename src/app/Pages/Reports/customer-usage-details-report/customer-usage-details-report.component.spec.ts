import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUsageDetailsReportComponent } from './customer-usage-details-report.component';

describe('CustomerUsageDetailsReportComponent', () => {
  let component: CustomerUsageDetailsReportComponent;
  let fixture: ComponentFixture<CustomerUsageDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerUsageDetailsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerUsageDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
