import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianPerformanceReportComponent } from './technician-performance-report.component';

describe('TechnicianPerformanceReportComponent', () => {
  let component: TechnicianPerformanceReportComponent;
  let fixture: ComponentFixture<TechnicianPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianPerformanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
