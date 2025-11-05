import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceUtilizationReportComponent } from './service-utilization-report.component';

describe('ServiceUtilizationReportComponent', () => {
  let component: ServiceUtilizationReportComponent;
  let fixture: ComponentFixture<ServiceUtilizationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceUtilizationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceUtilizationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
