import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTransactionHistoryReportComponent } from './email-transaction-history-report.component';

describe('EmailTransactionHistoryReportComponent', () => {
  let component: EmailTransactionHistoryReportComponent;
  let fixture: ComponentFixture<EmailTransactionHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTransactionHistoryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTransactionHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
