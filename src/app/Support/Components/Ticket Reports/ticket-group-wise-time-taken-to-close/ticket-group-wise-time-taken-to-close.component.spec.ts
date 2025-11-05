import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGroupWiseTimeTakenToCloseComponent } from './ticket-group-wise-time-taken-to-close.component';

describe('TicketGroupWiseTimeTakenToCloseComponent', () => {
  let component: TicketGroupWiseTimeTakenToCloseComponent;
  let fixture: ComponentFixture<TicketGroupWiseTimeTakenToCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketGroupWiseTimeTakenToCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketGroupWiseTimeTakenToCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
