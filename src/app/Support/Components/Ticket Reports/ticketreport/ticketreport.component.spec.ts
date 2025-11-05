import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketreportComponent } from './ticketreport.component';

describe('TicketreportComponent', () => {
  let component: TicketreportComponent;
  let fixture: ComponentFixture<TicketreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
