import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerTemplateCategoryComponent } from './drawer-template-category.component';

describe('DrawerTemplateCategoryComponent', () => {
  let component: DrawerTemplateCategoryComponent;
  let fixture: ComponentFixture<DrawerTemplateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerTemplateCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerTemplateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
