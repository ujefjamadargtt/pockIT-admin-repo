import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailedReportComponent } from './order-detailed-report.component';

describe('OrderDetailedReportComponent', () => {
  let component: OrderDetailedReportComponent;
  let fixture: ComponentFixture<OrderDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
