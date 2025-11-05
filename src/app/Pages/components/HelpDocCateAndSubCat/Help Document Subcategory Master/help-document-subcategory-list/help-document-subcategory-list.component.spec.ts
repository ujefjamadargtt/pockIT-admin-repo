import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDocumentSubcategoryListComponent } from './help-document-subcategory-list.component';

describe('HelpDocumentSubcategoryListComponent', () => {
  let component: HelpDocumentSubcategoryListComponent;
  let fixture: ComponentFixture<HelpDocumentSubcategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDocumentSubcategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDocumentSubcategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
