import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponDetailedReportComponent } from './coupon-detailed-report.component';

describe('CouponDetailedReportComponent', () => {
  let component: CouponDetailedReportComponent;
  let fixture: ComponentFixture<CouponDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
