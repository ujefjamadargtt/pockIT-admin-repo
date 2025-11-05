import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewchatticketComponent } from './viewchatticket.component';

describe('ViewchatticketComponent', () => {
  let component: ViewchatticketComponent;
  let fixture: ComponentFixture<ViewchatticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewchatticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewchatticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
