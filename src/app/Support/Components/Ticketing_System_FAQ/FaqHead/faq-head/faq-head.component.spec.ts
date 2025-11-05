import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqHeadComponent } from './faq-head.component';

describe('FaqHeadComponent', () => {
  let component: FaqHeadComponent;
  let fixture: ComponentFixture<FaqHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
