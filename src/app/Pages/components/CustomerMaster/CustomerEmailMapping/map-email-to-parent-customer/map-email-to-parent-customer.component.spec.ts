import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEmailToParentCustomerComponent } from './map-email-to-parent-customer.component';

describe('MapEmailToParentCustomerComponent', () => {
  let component: MapEmailToParentCustomerComponent;
  let fixture: ComponentFixture<MapEmailToParentCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapEmailToParentCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapEmailToParentCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
