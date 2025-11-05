import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqHeadsComponent } from './faq-heads.component';

describe('FaqHeadsComponent', () => {
  let component: FaqHeadsComponent;
  let fixture: ComponentFixture<FaqHeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqHeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
