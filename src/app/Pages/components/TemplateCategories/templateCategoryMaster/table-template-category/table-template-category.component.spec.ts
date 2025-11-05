import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTemplateCategoryComponent } from './table-template-category.component';

describe('TableTemplateCategoryComponent', () => {
  let component: TableTemplateCategoryComponent;
  let fixture: ComponentFixture<TableTemplateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTemplateCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTemplateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
