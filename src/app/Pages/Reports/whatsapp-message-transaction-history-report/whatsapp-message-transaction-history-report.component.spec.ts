import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMessageTransactionHistoryReportComponent } from './whatsapp-message-transaction-history-report.component';

describe('WhatsappMessageTransactionHistoryReportComponent', () => {
  let component: WhatsappMessageTransactionHistoryReportComponent;
  let fixture: ComponentFixture<WhatsappMessageTransactionHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappMessageTransactionHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappMessageTransactionHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
