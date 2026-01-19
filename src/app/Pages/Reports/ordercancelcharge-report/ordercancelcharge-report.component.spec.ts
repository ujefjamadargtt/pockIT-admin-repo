import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercancelchargeReportComponent } from './ordercancelcharge-report.component';

describe('OrdercancelchargeReportComponent', () => {
  let component: OrdercancelchargeReportComponent;
  let fixture: ComponentFixture<OrdercancelchargeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdercancelchargeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdercancelchargeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
