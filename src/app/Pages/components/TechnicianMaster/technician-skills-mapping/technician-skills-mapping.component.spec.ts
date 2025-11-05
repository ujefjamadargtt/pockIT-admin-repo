import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianSkillsMappingComponent } from './technician-skills-mapping.component';

describe('TechnicianSkillsMappingComponent', () => {
  let component: TechnicianSkillsMappingComponent;
  let fixture: ComponentFixture<TechnicianSkillsMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicianSkillsMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianSkillsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
