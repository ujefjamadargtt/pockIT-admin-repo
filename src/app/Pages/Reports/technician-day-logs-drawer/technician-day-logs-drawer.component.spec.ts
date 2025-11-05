import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianDayLogsDrawerComponent } from './technician-day-logs-drawer.component';

describe('TechnicianDayLogsDrawerComponent', () => {
  let component: TechnicianDayLogsDrawerComponent;
  let fixture: ComponentFixture<TechnicianDayLogsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianDayLogsDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianDayLogsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
