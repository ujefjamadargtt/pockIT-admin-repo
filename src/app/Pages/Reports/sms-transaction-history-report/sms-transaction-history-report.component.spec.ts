import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTransactionHistoryReportComponent } from './sms-transaction-history-report.component';

describe('SmsTransactionHistoryReportComponent', () => {
  let component: SmsTransactionHistoryReportComponent;
  let fixture: ComponentFixture<SmsTransactionHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsTransactionHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsTransactionHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
