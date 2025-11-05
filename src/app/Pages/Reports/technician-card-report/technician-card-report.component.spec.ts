import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianCardReportComponent } from './technician-card-report.component';

describe('TechnicianCardReportComponent', () => {
  let component: TechnicianCardReportComponent;
  let fixture: ComponentFixture<TechnicianCardReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianCardReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianCardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
