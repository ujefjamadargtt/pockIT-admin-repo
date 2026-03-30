import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUsageReportComponent } from './customer-usage-report.component';

describe('CustomerUsageReportComponent', () => {
  let component: CustomerUsageReportComponent;
  let fixture: ComponentFixture<CustomerUsageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerUsageReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerUsageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
