import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryWiseWalletTransactionComponent } from './territory-wise-wallet-transaction.component';

describe('TerritoryWiseWalletTransactionComponent', () => {
  let component: TerritoryWiseWalletTransactionComponent;
  let fixture: ComponentFixture<TerritoryWiseWalletTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryWiseWalletTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerritoryWiseWalletTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
