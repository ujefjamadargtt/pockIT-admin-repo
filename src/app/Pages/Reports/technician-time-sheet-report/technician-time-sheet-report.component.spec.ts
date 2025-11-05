import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianTimeSheetReportComponent } from './technician-time-sheet-report.component';

describe('TechnicianTimeSheetReportComponent', () => {
  let component: TechnicianTimeSheetReportComponent;
  let fixture: ComponentFixture<TechnicianTimeSheetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianTimeSheetReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianTimeSheetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
