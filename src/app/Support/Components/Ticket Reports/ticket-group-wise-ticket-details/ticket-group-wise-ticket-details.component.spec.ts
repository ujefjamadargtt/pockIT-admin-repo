import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGroupWiseTicketDetailsComponent } from './ticket-group-wise-ticket-details.component';

describe('TicketGroupWiseTicketDetailsComponent', () => {
  let component: TicketGroupWiseTicketDetailsComponent;
  let fixture: ComponentFixture<TicketGroupWiseTicketDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketGroupWiseTicketDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketGroupWiseTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
