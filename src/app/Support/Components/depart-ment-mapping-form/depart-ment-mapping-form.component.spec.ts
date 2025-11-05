import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartMentMappingFormComponent } from './depart-ment-mapping-form.component';

describe('DepartMentMappingFormComponent', () => {
  let component: DepartMentMappingFormComponent;
  let fixture: ComponentFixture<DepartMentMappingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartMentMappingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartMentMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
