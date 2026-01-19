import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancellationChargesComponent } from './order-cancellation-charges.component';

describe('OrderCancellationChargesComponent', () => {
  let component: OrderCancellationChargesComponent;
  let fixture: ComponentFixture<OrderCancellationChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCancellationChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCancellationChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
