import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketautocloseComponent } from './ticketautoclose.component';

describe('TicketautocloseComponent', () => {
  let component: TicketautocloseComponent;
  let fixture: ComponentFixture<TicketautocloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketautocloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketautocloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
