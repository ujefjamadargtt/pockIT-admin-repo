import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDocumentCategoryListComponent } from './help-document-category-list.component';

describe('HelpDocumentCategoryListComponent', () => {
  let component: HelpDocumentCategoryListComponent;
  let fixture: ComponentFixture<HelpDocumentCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDocumentCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDocumentCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
