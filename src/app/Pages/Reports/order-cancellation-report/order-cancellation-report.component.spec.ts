import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancellationReportComponent } from './order-cancellation-report.component';

describe('OrderCancellationReportComponent', () => {
  let component: OrderCancellationReportComponent;
  let fixture: ComponentFixture<OrderCancellationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCancellationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCancellationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
