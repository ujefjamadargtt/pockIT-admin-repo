import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaterWiseAutoCloseTicketReportComponent } from './creater-wise-auto-close-ticket-report.component';

describe('CreaterWiseAutoCloseTicketReportComponent', () => {
  let component: CreaterWiseAutoCloseTicketReportComponent;
  let fixture: ComponentFixture<CreaterWiseAutoCloseTicketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreaterWiseAutoCloseTicketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaterWiseAutoCloseTicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
