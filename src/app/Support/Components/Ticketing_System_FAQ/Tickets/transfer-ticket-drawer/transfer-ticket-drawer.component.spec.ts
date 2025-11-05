import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTicketDrawerComponent } from './transfer-ticket-drawer.component';

describe('TransferTicketDrawerComponent', () => {
  let component: TransferTicketDrawerComponent;
  let fixture: ComponentFixture<TransferTicketDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTicketDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTicketDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
