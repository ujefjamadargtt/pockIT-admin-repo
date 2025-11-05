import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWiseAutoCloseTicketComponent } from './group-wise-auto-close-ticket.component';

describe('GroupWiseAutoCloseTicketComponent', () => {
  let component: GroupWiseAutoCloseTicketComponent;
  let fixture: ComponentFixture<GroupWiseAutoCloseTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWiseAutoCloseTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWiseAutoCloseTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
