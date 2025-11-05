import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTImeSlotsComponent } from './customer-time-slots.component';

describe('CustomerTImeSlotsComponent', () => {
  let component: CustomerTImeSlotsComponent;
  let fixture: ComponentFixture<CustomerTImeSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTImeSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTImeSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
