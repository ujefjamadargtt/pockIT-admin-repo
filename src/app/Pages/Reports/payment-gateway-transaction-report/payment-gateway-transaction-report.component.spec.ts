import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGatewayTransactionReportComponent } from './payment-gateway-transaction-report.component';

describe('PaymentGatewayTransactionReportComponent', () => {
  let component: PaymentGatewayTransactionReportComponent;
  let fixture: ComponentFixture<PaymentGatewayTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentGatewayTransactionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentGatewayTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
