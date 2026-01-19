import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercancelwiseDetailedReportComponent } from './ordercancelwise-detailed-report.component';

describe('OrdercancelwiseDetailedReportComponent', () => {
  let component: OrdercancelwiseDetailedReportComponent;
  let fixture: ComponentFixture<OrdercancelwiseDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdercancelwiseDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdercancelwiseDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
