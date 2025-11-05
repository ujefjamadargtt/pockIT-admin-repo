import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationReportComponent } from './customer-registration-report.component';

describe('CustomerRegistrationReportComponent', () => {
  let component: CustomerRegistrationReportComponent;
  let fixture: ComponentFixture<CustomerRegistrationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRegistrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
