import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillStatusComponent } from './skill-status.component';

describe('SkillStatusComponent', () => {
  let component: SkillStatusComponent;
  let fixture: ComponentFixture<SkillStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
