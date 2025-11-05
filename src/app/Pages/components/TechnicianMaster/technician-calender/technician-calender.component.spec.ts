import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianCalenderComponent } from './technician-calender.component';

describe('TechnicianCalenderComponent', () => {
  let component: TechnicianCalenderComponent;
  let fixture: ComponentFixture<TechnicianCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianCalenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
