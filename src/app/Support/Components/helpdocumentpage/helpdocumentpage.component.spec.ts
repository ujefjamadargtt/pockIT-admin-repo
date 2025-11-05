import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdocumentpageComponent } from './helpdocumentpage.component';

describe('HelpdocumentpageComponent', () => {
  let component: HelpdocumentpageComponent;
  let fixture: ComponentFixture<HelpdocumentpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpdocumentpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpdocumentpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
