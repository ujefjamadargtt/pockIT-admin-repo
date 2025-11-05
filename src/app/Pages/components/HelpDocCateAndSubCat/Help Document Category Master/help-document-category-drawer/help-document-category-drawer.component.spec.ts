import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDocumentCategoryDrawerComponent } from './help-document-category-drawer.component';

describe('HelpDocumentCategoryDrawerComponent', () => {
  let component: HelpDocumentCategoryDrawerComponent;
  let fixture: ComponentFixture<HelpDocumentCategoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDocumentCategoryDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDocumentCategoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
