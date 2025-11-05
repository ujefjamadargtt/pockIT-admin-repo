import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianLanguageMappingComponent } from './technician-language-mapping.component';

describe('TechnicianLanguageMappingComponent', () => {
  let component: TechnicianLanguageMappingComponent;
  let fixture: ComponentFixture<TechnicianLanguageMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianLanguageMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianLanguageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
