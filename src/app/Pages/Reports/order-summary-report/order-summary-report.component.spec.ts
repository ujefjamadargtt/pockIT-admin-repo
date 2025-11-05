import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSummaryReportComponent } from './order-summary-report.component';

describe('OrderSummaryReportComponent', () => {
  let component: OrderSummaryReportComponent;
  let fixture: ComponentFixture<OrderSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
