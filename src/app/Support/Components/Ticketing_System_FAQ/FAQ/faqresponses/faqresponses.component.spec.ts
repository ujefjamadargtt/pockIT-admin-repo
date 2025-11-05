import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqresponsesComponent } from './faqresponses.component';

describe('FaqresponsesComponent', () => {
  let component: FaqresponsesComponent;
  let fixture: ComponentFixture<FaqresponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqresponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqresponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
