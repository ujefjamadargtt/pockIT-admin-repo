import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEmailToChildCustomerComponent } from './map-email-to-child-customer.component';

describe('MapEmailToChildCustomerComponent', () => {
  let component: MapEmailToChildCustomerComponent;
  let fixture: ComponentFixture<MapEmailToChildCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapEmailToChildCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapEmailToChildCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
