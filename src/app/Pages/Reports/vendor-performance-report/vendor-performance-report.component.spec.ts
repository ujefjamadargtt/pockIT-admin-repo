import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPerformanceReportComponent } from './vendor-performance-report.component';

describe('VendorPerformanceReportComponent', () => {
  let component: VendorPerformanceReportComponent;
  let fixture: ComponentFixture<VendorPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorPerformanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
