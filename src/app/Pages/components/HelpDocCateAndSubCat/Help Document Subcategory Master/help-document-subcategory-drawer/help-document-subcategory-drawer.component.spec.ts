import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDocumentSubcategoryDrawerComponent } from './help-document-subcategory-drawer.component';

describe('HelpDocumentSubcategoryDrawerComponent', () => {
  let component: HelpDocumentSubcategoryDrawerComponent;
  let fixture: ComponentFixture<HelpDocumentSubcategoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDocumentSubcategoryDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDocumentSubcategoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
