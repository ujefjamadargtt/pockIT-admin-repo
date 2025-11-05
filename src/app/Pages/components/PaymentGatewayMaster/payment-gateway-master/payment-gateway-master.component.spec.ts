import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGatewayMasterComponent } from './payment-gateway-master.component';

describe('PaymentGatewayMasterComponent', () => {
  let component: PaymentGatewayMasterComponent;
  let fixture: ComponentFixture<PaymentGatewayMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentGatewayMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentGatewayMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
