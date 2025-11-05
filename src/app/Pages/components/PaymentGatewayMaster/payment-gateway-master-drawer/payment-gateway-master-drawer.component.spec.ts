import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGatewayMasterDrawerComponent } from './payment-gateway-master-drawer.component';

describe('PaymentGatewayMasterDrawerComponent', () => {
  let component: PaymentGatewayMasterDrawerComponent;
  let fixture: ComponentFixture<PaymentGatewayMasterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentGatewayMasterDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentGatewayMasterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
