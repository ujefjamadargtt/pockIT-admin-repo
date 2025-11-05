import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentgatewaysComponent } from './paymentgateways.component';

describe('PaymentgatewaysComponent', () => {
  let component: PaymentgatewaysComponent;
  let fixture: ComponentFixture<PaymentgatewaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentgatewaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentgatewaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
