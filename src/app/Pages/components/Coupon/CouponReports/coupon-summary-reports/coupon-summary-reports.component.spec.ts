import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponSummaryReportsComponent } from './coupon-summary-reports.component';

describe('CouponSummaryReportsComponent', () => {
  let component: CouponSummaryReportsComponent;
  let fixture: ComponentFixture<CouponSummaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponSummaryReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponSummaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
