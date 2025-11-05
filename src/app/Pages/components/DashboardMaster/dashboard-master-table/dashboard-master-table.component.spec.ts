import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMasterTableComponent } from './dashboard-master-table.component';

describe('DashboardMasterTableComponent', () => {
  let component: DashboardMasterTableComponent;
  let fixture: ComponentFixture<DashboardMasterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMasterTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
