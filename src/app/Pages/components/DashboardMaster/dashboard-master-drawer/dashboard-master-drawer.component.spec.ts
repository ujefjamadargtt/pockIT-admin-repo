import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMasterDrawerComponent } from './dashboard-master-drawer.component';

describe('DashboardMasterDrawerComponent', () => {
  let component: DashboardMasterDrawerComponent;
  let fixture: ComponentFixture<DashboardMasterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMasterDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMasterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
