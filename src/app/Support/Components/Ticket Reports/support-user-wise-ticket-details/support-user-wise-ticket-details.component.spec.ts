import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUserWiseTicketDetailsComponent } from './support-user-wise-ticket-details.component';

describe('SupportUserWiseTicketDetailsComponent', () => {
  let component: SupportUserWiseTicketDetailsComponent;
  let fixture: ComponentFixture<SupportUserWiseTicketDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportUserWiseTicketDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportUserWiseTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
