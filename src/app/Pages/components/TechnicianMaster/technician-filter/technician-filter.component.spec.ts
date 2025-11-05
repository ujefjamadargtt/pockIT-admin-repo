import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianFilterComponent } from './technician-filter.component';

describe('TechnicianFilterComponent', () => {
  let component: TechnicianFilterComponent;
  let fixture: ComponentFixture<TechnicianFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
