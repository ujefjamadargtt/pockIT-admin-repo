import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGroupWiseSummaryComponent } from './ticket-group-wise-summary.component';

describe('TicketGroupWiseSummaryComponent', () => {
  let component: TicketGroupWiseSummaryComponent;
  let fixture: ComponentFixture<TicketGroupWiseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketGroupWiseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketGroupWiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
