import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderwiseJobCardDetailedReportComponent } from './orderwise-job-card-detailed-report.component';

describe('OrderwiseJobCardDetailedReportComponent', () => {
  let component: OrderwiseJobCardDetailedReportComponent;
  let fixture: ComponentFixture<OrderwiseJobCardDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderwiseJobCardDetailedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderwiseJobCardDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
