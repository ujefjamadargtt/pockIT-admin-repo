import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerwiseWalletReportComponent } from './customerwise-wallet-report.component';

describe('CustomerwiseWalletReportComponent', () => {
  let component: CustomerwiseWalletReportComponent;
  let fixture: ComponentFixture<CustomerwiseWalletReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerwiseWalletReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerwiseWalletReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
