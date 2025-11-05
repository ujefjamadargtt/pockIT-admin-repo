import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketgroupComponent } from './ticketgroup.component';

describe('TicketgroupComponent', () => {
  let component: TicketgroupComponent;
  let fixture: ComponentFixture<TicketgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
