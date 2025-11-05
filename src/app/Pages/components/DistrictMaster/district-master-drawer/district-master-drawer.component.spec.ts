import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictMasterDrawerComponent } from './district-master-drawer.component';

describe('DistrictMasterDrawerComponent', () => {
  let component: DistrictMasterDrawerComponent;
  let fixture: ComponentFixture<DistrictMasterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictMasterDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictMasterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
