import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLanguageTranslationComponent } from './app-language-translation.component';

describe('AppLanguageTranslationComponent', () => {
  let component: AppLanguageTranslationComponent;
  let fixture: ComponentFixture<AppLanguageTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLanguageTranslationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLanguageTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
