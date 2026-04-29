import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionReportComponent } from './payment-transaction-report.component';

describe('PaymentTransactionReportComponent', () => {
  let component: PaymentTransactionReportComponent;
  let fixture: ComponentFixture<PaymentTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTransactionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
