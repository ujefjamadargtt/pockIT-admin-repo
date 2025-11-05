import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianPincodeMappingComponent } from './technician-pincode-mapping.component';

describe('TechnicianPincodeMappingComponent', () => {
  let component: TechnicianPincodeMappingComponent;
  let fixture: ComponentFixture<TechnicianPincodeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianPincodeMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianPincodeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
