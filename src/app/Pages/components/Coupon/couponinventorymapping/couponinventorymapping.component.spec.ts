import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponinventorymappingComponent } from './couponinventorymapping.component';

describe('CouponinventorymappingComponent', () => {
  let component: CouponinventorymappingComponent;
  let fixture: ComponentFixture<CouponinventorymappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponinventorymappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponinventorymappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
