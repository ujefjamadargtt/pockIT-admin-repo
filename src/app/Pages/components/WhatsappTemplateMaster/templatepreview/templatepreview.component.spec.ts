import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatepreviewComponent } from './templatepreview.component';

describe('TemplatepreviewComponent', () => {
  let component: TemplatepreviewComponent;
  let fixture: ComponentFixture<TemplatepreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatepreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatepreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
