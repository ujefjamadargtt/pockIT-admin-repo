import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerwiseWalletTransactionReportComponent } from './customerwise-wallet-transaction-report.component';

describe('CustomerwiseWalletTransactionReportComponent', () => {
  let component: CustomerwiseWalletTransactionReportComponent;
  let fixture: ComponentFixture<CustomerwiseWalletTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerwiseWalletTransactionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerwiseWalletTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
