import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattdetailsicketComponent } from './chattdetailsicket.component';

describe('ChattdetailsicketComponent', () => {
  let component: ChattdetailsicketComponent;
  let fixture: ComponentFixture<ChattdetailsicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChattdetailsicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChattdetailsicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
